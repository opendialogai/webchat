<?php

namespace OpenDialogAi\Webchat\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Response;
use OpenDialogAi\ConversationLog\ChatbotUser;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Http\Request;
use OpenDialogAi\ConversationLog\Message;

class HistoryController
{
    const TEXT_EXTERNAL = 'text_external';
    const CHATBOT = 'chatbot';
    const CHATBOT_USER = 'chatbot_user';
    const BUTTON_RESPONSE = 'button_response';
    const FORM_RESPONSE = 'form_response';

    /**
     * @param string $user_id
     * @return
     */
    public function export($user_id)
    {
        $ignoredMessageTypes = ['chat_open', 'cta', 'hand-to-human'];

        $chatbotUser = ChatbotUser::where('user_id', $user_id)->first();

        $text = '';
        foreach ($chatbotUser->messages->reverse() as $message) {
            if (!in_array($message->type, $ignoredMessageTypes)) {
                $author = $this->getMessageAuthor($message);

                if ($message->type == self::BUTTON_RESPONSE) {
                    $messageText = $message->data['text'];
                } elseif ($message->type == self::FORM_RESPONSE) {
                    $messageText = 'Form submitted';
                } else {
                    $messageText = $message->message;
                }

                $date = Carbon::createFromFormat('Y-m-d H:i:s.u', $message->microtime)
                  ->format('Y-m-d H:i');

                $text .= sprintf("%s - %s: %s\n", $date, $author, $messageText);
            }
        }

        $response = new StreamedResponse();
        $response->setCallBack(function() use($text) {
            echo $text;
        });
        $disposition = $response->headers->makeDisposition(ResponseHeaderBag::DISPOSITION_ATTACHMENT, 'history.txt');
        $response->headers->set('Content-Disposition', $disposition);
        $response->headers->set('Content-Type', 'text/plain');

        return $response;
    }

    /**
     * Handle the incoming request.
     *
     * @param Request $request
     * @param  string  $user_id
     * @return Response
     */
    public function add(Request $request, $user_id)
    {
        $message = json_decode($request->getContent());

        $date = sprintf('%s %s %s', $message->date, date('Y'), $message->time);
        $microtime = Carbon::createFromFormat('D j M Y g:i A', $date)->format('Y-m-d H:i:s.u');

        $author = ($message->author == 'me') ? $user_id : $message->author;

        $historyMessage = Message::create(
            $microtime,
            self::TEXT_EXTERNAL,
            $user_id,
            $author,
            $message->text,
        );
        $historyMessage->save();

        return response()->noContent(200);
    }

    /**
     * @param $message
     * @return string
     */
    private function getMessageAuthor($message): string
    {
        $text = $message->author;
        if ($message->author == 'them') {
            $text = self::CHATBOT;
        } elseif ($message->author == $message->user_id) {
            $text = self::CHATBOT_USER;
        }
        return $text;
    }
}
