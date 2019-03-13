<?php

namespace OpenDialogAi\Webchat;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property String $name
 * @property String $value
 * @property String $type
 */
class WebchatSetting extends Model
{
    const URL                   = 'url';
    const TEAM_NAME             = 'teamName';
    const VALID_PATH            = 'validPath';
    const MESSAGE_DELAY         = 'messageDelay';
    const OPEN                  = 'open';
    const CUSTOM_CSS_PATH       = 'customCssPath';
    const HIDE_OPEN_CLOSE_ICONS = 'hideOpenCloseIcons';
    const CALLBACK_MAP          = 'callbackMap';
    const DISABLE_CLOSE_CHAT    = 'disableCloseChat';
    const START_MINIMIZED       = 'startMinimized';

    // Colours
    const HEADER_BACKGROUND           = 'headerBackground';
    const HEADER_TEXT                 = 'headerText';
    const LAUNCHER_BACKGROUND         = 'launcherBackground';
    const MESSAGE_LIST_BACKGROUND     = 'messageListBackground';
    const SENT_MESSAGE_BACKGROUND     = 'sentMessageBackground';
    const SENT_MESSAGE_TEXT           = 'sentMessageText';
    const RECEIVED_MESSAGE_BACKGROUND = 'receivedMessageBackground';
    const RECEIVED_MESSAGE_TEXT       = 'receivedMessageText';
    const USER_INPUT_BACKGROUND       = 'userInputBackground';
    const USER_INPUT_TEXT             = 'userInputText';

    // Types
    const STRING  = 'string';
    const NUMBER  = 'number';
    const COLOUR  = 'colour';
    const MAP     = 'map';
    const BOOLEAN = 'boolean';
}
