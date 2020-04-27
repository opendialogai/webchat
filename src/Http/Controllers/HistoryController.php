<?php

namespace OpenDialogAi\Webchat\Http\Controllers;

use Carbon\Carbon;
use OpenDialogAi\ConversationLog\ChatbotUser;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Http\Request;
use OpenDialogAi\ConversationLog\Message;

class HistoryController
{
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
                if ($message->author == 'them') {
                    $text .= 'chatbot';
                } elseif ($message->author == $message->user_id) {
                    $text .= 'chatbot_user';
                } else {
                    $text .= $message->author;
                }
                $text .= ' - ';

                if ($message->type == 'button_response') {
                    $text .= $message->data['text'];
                } elseif ($message->type == 'form_response') {
                    $formData = [];
                    foreach ($message->data as $key => $value) {
                        if ($key != 'text' && $key != 'date' && $key != 'time') {
                            $formData[] = $key . ': ' . $value;
                        }
                    }
                    $text .= 'Form submitted: ' . implode(', ', $formData);
                } else {
                    $text .= $message->message;
                }
                $text .= ' - ';

                $text .= Carbon::createFromFormat('Y-m-d H:i:s.u', $message->microtime)
                  ->format('Y-m-d H:i');

                $text .= "\n";
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
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $user_id
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, $user_id)
    {
        $message = json_decode($request->getContent());

        $microtime = Carbon::parse($message->datetime)->format('Y-m-d H:i:s.u');
        $type = 'text';
        $author = $message->author;
        $messageText = $message->text;

        $historyMessage = Message::create(
            $microtime,
            $type,
            $user_id,
            $author,
            $messageText,
        );
        $historyMessage->save();

        return response()->noContent(200);
    }
}
