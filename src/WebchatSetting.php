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
    // General
    public const GENERAL                   = 'general';
    public const URL                       = 'url';
    public const TEAM_NAME                 = 'teamName';
    public const LOGO                      = 'logo';
    public const VALID_PATH                = 'validPath';
    public const MESSAGE_DELAY             = 'messageDelay';
    public const OPEN                      = 'open';
    public const CHATBOT_CSS_PATH          = 'chatbotCssPath';
    public const CHATBOT_FULLPAGE_CSS_PATH = 'chatbotFullpageCssPath';
    public const PAGE_CSS_PATH             = 'pageCssPath';
    public const HIDE_DATETIME_MESSAGE     = 'hideDatetimeMessage';
    public const HIDE_MESSAGE_TIME         = 'hideMessageTime';
    public const CALLBACK_MAP              = 'callbackMap';
    public const DISABLE_CLOSE_CHAT        = 'disableCloseChat';
    public const START_MINIMIZED           = 'startMinimized';
    public const CHATBOT_NAME              = 'chatbotName';
    public const CHATBOT_AVATAR_PATH       = 'chatbotAvatarPath';
    public const USE_BOT_AVATAR            = 'useBotAvatar';
    public const WEBCHAT_FULL_PAGE_PUBLIC  = 'webChatFullPagePublic';
    public const USE_HUMAN_AVATAR          = 'useHumanAvatar';
    public const USE_BOT_NAME              = 'useBotName';
    public const USE_HUMAN_NAME            = 'useHumanName';
    public const COLLECT_USER_IP           = 'collectUserIp';
    public const SHOW_RESTART_BUTTON       = 'showRestartButton';
    public const RESTART_BUTTON_CALLBACK   = 'restartButtonCallback';
    public const MESSAGE_ANIMATION         = 'messageAnimation';
    public const USER_TYPE                 = 'userType';
    public const SHOW_MINIMIZED            = 'showMinimized';
    public const OPEN_INTENT               = 'openIntent';
    public const NEW_USER_START_MINIMIZED       = 'newUserStartMinimized';
    public const NEW_USER_OPEN_CALLBACK         = 'newUserOpenCallback';
    public const RETURNING_USER_START_MINIMIZED = 'returningUserStartMinimized';
    public const RETURNING_USER_OPEN_CALLBACK   = 'returningUserOpenCallback';
    public const ONGOING_USER_START_MINIMIZED   = 'ongoingUserStartMinimized';
    public const ONGOING_USER_OPEN_CALLBACK     = 'ongoingUserOpenCallback';
    public const HIDE_TYPING_INDICATOR_ON_INTERNAL_MESSAGES = 'hideTypingIndicatorOnInternalMessages';

    // Colours
    public const COLOURS                          = 'colours';
    public const HEADER_BACKGROUND                = 'headerBackground';
    public const HEADER_TEXT                      = 'headerText';
    public const LAUNCHER_BACKGROUND              = 'launcherBackground';
    public const MESSAGE_LIST_BACKGROUND          = 'messageListBackground';
    public const SENT_MESSAGE_BACKGROUND          = 'sentMessageBackground';
    public const SENT_MESSAGE_TEXT                = 'sentMessageText';
    public const RECEIVED_MESSAGE_BACKGROUND      = 'receivedMessageBackground';
    public const RECEIVED_MESSAGE_TEXT            = 'receivedMessageText';
    public const USER_INPUT_BACKGROUND            = 'userInputBackground';
    public const USER_INPUT_TEXT                  = 'userInputText';
    public const ICON_BACKGROUND                  = 'iconBackground';
    public const ICON_HOVER_BACKGROUND            = 'iconHoverBackground';
    public const BUTTON_BACKGROUND                = 'buttonBackground';
    public const BUTTON_HOVER_BACKGROUND          = 'buttonHoverBackground';
    public const BUTTON_TEXT                      = 'buttonText';
    public const EXTERNAL_BUTTON_BACKGROUND       = 'externalButtonBackground';
    public const EXTERNAL_BUTTON_HOVER_BACKGROUND = 'externalButtonHoverBackground';
    public const EXTERNAL_BUTTON_TEXT             = 'externalButtonText';

    // Comments
    public const COMMENTS                             = 'comments';
    public const COMMENTS_ENABLED                     = 'commentsEnabled';
    public const COMMENTS_NAME                        = 'commentsName';
    public const COMMENTS_ENABLED_PATH_PATTERN        = 'commentsEnabledPathPattern';
    public const COMMENTS_ENDPOINT                    = 'commentsEndpoint';
    public const COMMENTS_AUTH_TOKEN                  = 'commentsAuthToken';
    public const COMMENTS_ENTITY_NAME                 = 'commentsEntityName';
    public const COMMENTS_CREATED_FIELDNAME           = 'commentsCreatedFieldName';
    public const COMMENTS_TEXT_FIELDNAME              = 'commentsTextFieldName';
    public const COMMENTS_AUTHOR_ENTITY_NAME          = 'commentsAuthorEntityName';
    public const COMMENTS_AUTHOR_RELATIONSHIP_NAME    = 'commentsAuthorRelationshipName';
    public const COMMENTS_AUTHOR_ID_FIELDNAME         = 'commentsAuthorIdFieldName';
    public const COMMENTS_AUTHOR_NAME_FIELDNAME       = 'commentsAuthorNameFieldName';
    public const COMMENTS_SECTION_ENTITY_NAME         = 'commentsSectionEntityName';
    public const COMMENTS_SECTION_RELATIONSHIP_NAME   = 'commentsSectionRelationshipName';
    public const COMMENTS_SECTION_ID_FIELDNAME        = 'commentsSectionIdFieldName';
    public const COMMENTS_SECTION_NAME_FIELDNAME      = 'commentsSectionNameFieldName';
    public const COMMENTS_SECTION_FILTER_PATH_PATTERN = 'commentsSectionFilterPathPattern';
    public const COMMENTS_SECTION_FILTER_QUERY        = 'commentsSectionFilterQuery';
    public const COMMENTS_SECTION_PATH_PATTERN        = 'commentsSectionPathPattern';

    // History
    public const WEBCHAT_HISTORY    = 'webchatHistory';
    public const SHOW_HISTORY       = 'showHistory';
    public const NUMBER_OF_MESSAGES = 'numberOfMessages';

    // Types
    public const STRING  = 'string';
    public const NUMBER  = 'number';
    public const COLOUR  = 'colour';
    public const MAP     = 'map';
    public const BOOLEAN = 'boolean';
    public const OBJECT  = 'object';

    // Bot
    public const BOT = 'bot';
    public const INPUT_PLACEHOLDER = 'inputPlaceholder';
    public const SEND_BUTTON_TEXT = 'sendButtonText';
    public const END_CHAT_TEXT = 'endChatText';
    public const END_CHAT_CONFIRMATION_MESSAGE = 'endChatConfirmationMessage';
    public const END_CHAT_CONFIRMATION_POSITIVE = 'endChatConfirmationPositive';
    public const END_CHAT_CONFIRMATION_NEGATIVE = 'endChatConfirmationNegative';

    protected $fillable = ['name', 'type', 'value'];

    /**
     * Define parent relationship.
     */
    public function parent()
    {
        return $this->belongsTo('OpenDialogAi\Webchat\WebchatSetting', 'parent_id');
    }

    /**
     * Define child relationship.
     */
    public function children()
    {
        return $this->hasMany('OpenDialogAi\Webchat\WebchatSetting', 'parent_id');
    }

    /**
     * get flag for webchat setting permission
     * in order to allow view of web-chat url or not
     *
     */
    public static function getWebChatPermission()
    {
        $val =  WebchatSetting::select('value')
            ->where('name', WebchatSetting::WEBCHAT_FULL_PAGE_PUBLIC)
            ->first();

        return $val->value;
    }

    public static function getSettings()
    {
        $settings = [
            WebchatSetting::GENERAL => [
                WebchatSetting::STRING => [
                    WebchatSetting::URL,
                    WebchatSetting::TEAM_NAME,
                    WebchatSetting::LOGO,
                    WebchatSetting::CHATBOT_CSS_PATH,
                    WebchatSetting::CHATBOT_FULLPAGE_CSS_PATH,
                    WebchatSetting::PAGE_CSS_PATH,
                    WebchatSetting::CHATBOT_NAME,
                    WebchatSetting::CHATBOT_AVATAR_PATH,
                    WebchatSetting::RESTART_BUTTON_CALLBACK,
                    WebchatSetting::NEW_USER_OPEN_CALLBACK,
                    WebchatSetting::RETURNING_USER_OPEN_CALLBACK,
                    WebchatSetting::ONGOING_USER_OPEN_CALLBACK,
                ],
                WebchatSetting::BOOLEAN => [
                    WebchatSetting::OPEN,
                    WebchatSetting::HIDE_DATETIME_MESSAGE,
                    WebchatSetting::HIDE_MESSAGE_TIME,
                    WebchatSetting::DISABLE_CLOSE_CHAT,
                    WebchatSetting::START_MINIMIZED,
                    WebchatSetting::USE_BOT_AVATAR,
                    WebchatSetting::USE_HUMAN_AVATAR,
                    WebchatSetting::WEBCHAT_FULL_PAGE_PUBLIC,
                    WebchatSetting::USE_BOT_NAME,
                    WebchatSetting::USE_HUMAN_NAME,
                    WebchatSetting::COLLECT_USER_IP,
                    WebchatSetting::SHOW_RESTART_BUTTON,
                    WebchatSetting::MESSAGE_ANIMATION,
                    WebchatSetting::HIDE_TYPING_INDICATOR_ON_INTERNAL_MESSAGES,
                    WebchatSetting::NEW_USER_START_MINIMIZED,
                    WebchatSetting::RETURNING_USER_START_MINIMIZED,
                    WebchatSetting::ONGOING_USER_START_MINIMIZED,
                ],
                WebchatSetting::NUMBER => [
                    WebchatSetting::MESSAGE_DELAY,
                ],
                WebchatSetting::MAP => [
                    WebchatSetting::VALID_PATH,
                    WebchatSetting::CALLBACK_MAP,
                ],
            ],
            WebchatSetting::COLOURS => [
                WebchatSetting::COLOUR => [
                    WebchatSetting::HEADER_BACKGROUND,
                    WebchatSetting::HEADER_TEXT,
                    WebchatSetting::LAUNCHER_BACKGROUND,
                    WebchatSetting::MESSAGE_LIST_BACKGROUND,
                    WebchatSetting::SENT_MESSAGE_BACKGROUND,
                    WebchatSetting::SENT_MESSAGE_TEXT,
                    WebchatSetting::RECEIVED_MESSAGE_BACKGROUND,
                    WebchatSetting::RECEIVED_MESSAGE_TEXT,
                    WebchatSetting::USER_INPUT_BACKGROUND,
                    WebchatSetting::USER_INPUT_TEXT,
                    WebchatSetting::ICON_BACKGROUND,
                    WebchatSetting::ICON_HOVER_BACKGROUND,
                    WebchatSetting::BUTTON_BACKGROUND,
                    WebchatSetting::BUTTON_HOVER_BACKGROUND,
                    WebchatSetting::BUTTON_TEXT,
                    WebchatSetting::EXTERNAL_BUTTON_BACKGROUND,
                    WebchatSetting::EXTERNAL_BUTTON_HOVER_BACKGROUND,
                    WebchatSetting::EXTERNAL_BUTTON_TEXT,
                ],
            ],
            WebchatSetting::COMMENTS => [
                WebchatSetting::BOOLEAN => [
                    WebchatSetting::COMMENTS_ENABLED,
                ],
                WebchatSetting::STRING => [
                    WebchatSetting::COMMENTS_NAME,
                    WebchatSetting::COMMENTS_ENABLED_PATH_PATTERN,
                    WebchatSetting::COMMENTS_ENTITY_NAME,
                    WebchatSetting::COMMENTS_CREATED_FIELDNAME,
                    WebchatSetting::COMMENTS_TEXT_FIELDNAME,
                    WebchatSetting::COMMENTS_ENDPOINT,
                    WebchatSetting::COMMENTS_AUTH_TOKEN,
                    WebchatSetting::COMMENTS_AUTHOR_ENTITY_NAME,
                    WebchatSetting::COMMENTS_AUTHOR_RELATIONSHIP_NAME,
                    WebchatSetting::COMMENTS_AUTHOR_ID_FIELDNAME,
                    WebchatSetting::COMMENTS_AUTHOR_NAME_FIELDNAME,
                    WebchatSetting::COMMENTS_SECTION_ENTITY_NAME,
                    WebchatSetting::COMMENTS_SECTION_RELATIONSHIP_NAME,
                    WebchatSetting::COMMENTS_SECTION_ID_FIELDNAME,
                    WebchatSetting::COMMENTS_SECTION_NAME_FIELDNAME,
                    WebchatSetting::COMMENTS_SECTION_FILTER_PATH_PATTERN,
                    WebchatSetting::COMMENTS_SECTION_FILTER_QUERY,
                    WebchatSetting::COMMENTS_SECTION_PATH_PATTERN,
                ],
            ],
            WebchatSetting::WEBCHAT_HISTORY => [
                WebchatSetting::BOOLEAN => [
                    WebchatSetting::SHOW_HISTORY,
                ],
                WebchatSetting::NUMBER => [
                    WebchatSetting::NUMBER_OF_MESSAGES,
                ],
            ],
            WebchatSetting::BOT => [
                WebchatSetting::STRING => [
                    WebchatSetting::INPUT_PLACEHOLDER,
                    WebchatSetting::SEND_BUTTON_TEXT,
                    WebchatSetting::END_CHAT_TEXT,
                    WebchatSetting::END_CHAT_CONFIRMATION_MESSAGE,
                    WebchatSetting::END_CHAT_CONFIRMATION_POSITIVE,
                    WebchatSetting::END_CHAT_CONFIRMATION_NEGATIVE,
                ]
            ]
        ];
        return $settings;
    }
}
