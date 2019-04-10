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
    const COLOURS                     = 'colours';
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

    // Comments
    const COMMENTS                             = 'comments';
    const COMMENTS_ENABLED                     = 'commentsEnabled';
    const COMMENTS_NAME                        = 'commentsName';
    const COMMENTS_ENABLED_PATH_PATTERN        = 'commentsEnabledPathPattern';
    const COMMENTS_AXIOS_CONFIG                = 'commentsAxiosConfig';
    const COMMENTS_ENTITY_NAME                 = 'commentsEntityName';
    const COMMENTS_CREATED_FIELDNAME           = 'commentsCreatedFieldName';
    const COMMENTS_TEXT_FIELDNAME              = 'commentsTextFieldName';
    const COMMENTS_AUTHOR_ENTITY_NAME          = 'commentsAuthorEntityName';
    const COMMENTS_AUTHOR_RELATIONSHIP_NAME    = 'commentsAuthorRelationshipName';
    const COMMENTS_AUTHOR_ID_FIELDNAME         = 'commentsAuthorIdFieldName';
    const COMMENTS_AUTHOR_NAME_FIELDNAME       = 'commentsAuthorNameFieldName';
    const COMMENTS_SECTION_ENTITY_NAME         = 'commentsSectionEntityName';
    const COMMENTS_SECTION_RELATIONSHIP_NAME   = 'commentsSectionRelationshipName';
    const COMMENTS_SECTION_ID_FIELDNAME        = 'commentsSectionIdFieldName';
    const COMMENTS_SECTION_NAME_FIELDNAME      = 'commentsSectionNameFieldName';
    const COMMENTS_SECTION_FILTER_PATH_PATTERN = 'commentsSectionFilterPathPattern';
    const COMMENTS_SECTION_FILTER_QUERY        = 'commentsSectionFilterQuery';
    const COMMENTS_SECTION_PATH_PATTERN        = 'commentsSectionPathPattern';

    // Types
    const STRING  = 'string';
    const NUMBER  = 'number';
    const COLOUR  = 'colour';
    const MAP     = 'map';
    const BOOLEAN = 'boolean';
    const OBJECT  = 'object';

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

    public static function getSettings()
    {
        $settings = [
            WebchatSetting::STRING => [
                WebchatSetting::URL,
                WebchatSetting::TEAM_NAME,
                WebchatSetting::CUSTOM_CSS_PATH,
            ],
            WebchatSetting::NUMBER => [
                WebchatSetting::MESSAGE_DELAY,
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
                WebchatSetting::OBJECT => [
                    WebchatSetting::COMMENTS_AXIOS_CONFIG
                ],
            ],
            WebchatSetting::MAP => [
                WebchatSetting::VALID_PATH,
                WebchatSetting::CALLBACK_MAP,
            ],
            WebchatSetting::BOOLEAN => [
                WebchatSetting::OPEN,
                WebchatSetting::HIDE_OPEN_CLOSE_ICONS,
                WebchatSetting::DISABLE_CLOSE_CHAT,
                WebchatSetting::START_MINIMIZED,
            ]
        ];
        return $settings;
    }
}
