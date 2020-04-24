<?php

namespace OpenDialogAi\Webchat\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use OpenDialogAi\ConversationLog\Message;

class HistoryController
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $user_id
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, $user_id)
    {
        $user_id = 'nicolo@istos.it';
        $message = json_decode($request->getContent());

        $date = sprintf('%s %s %s', $message->date, date('Y'), $message->time);

        $microtime = Carbon::createFromFormat('D j M Y g:i A', $date)->format('Y-m-d H:i:s.u');
        $type = 'text';
        $author = ($message->author == 'me') ? $user_id : $message->author;
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
