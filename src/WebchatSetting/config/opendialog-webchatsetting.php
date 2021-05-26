<?php

use OpenDialogAi\Webchat\WebchatSetting;

return [
    WebchatSetting::GENERAL => [
        WebchatSetting::URL => [
            WebchatSetting::DISPLAY_NAME => 'URL',
            WebchatSetting::DISPLAY => false,
            WebchatSetting::DESCRIPTION => 'The URL the bot is hosted at',
            WebchatSetting::TYPE => WebchatSetting::STRING,
        ],

        WebchatSetting::TEAM_NAME => [
            WebchatSetting::DISPLAY_NAME => 'Title',
            WebchatSetting::DESCRIPTION => 'The name displayed in the chatbot header',
            WebchatSetting::TYPE => WebchatSetting::STRING,
            WebchatSetting::SECTION => "General Settings",
            WebchatSetting::SUBSECTION => 'Header'
        ],

        WebchatSetting::LOGO => [
            WebchatSetting::DISPLAY_NAME => 'Logo Image URL',
            WebchatSetting::DESCRIPTION => 'The chatbot logo displayed in the header',
            WebchatSetting::TYPE => WebchatSetting::STRING,
            WebchatSetting::SECTION => "General Settings",
            WebchatSetting::SUBSECTION => 'Header'
        ],

        WebchatSetting::CHATBOT_CSS_PATH => [
            WebchatSetting::DISPLAY_NAME => 'Link to CSS file',
            WebchatSetting::DESCRIPTION => 'CSS for the iFrame chatbot',
            WebchatSetting::TYPE => WebchatSetting::STRING,
            WebchatSetting::SECTION => "Custom CSS",
            WebchatSetting::SUBSECTION => 'CSS for Chatbot'
        ],

        WebchatSetting::CHATBOT_FULLPAGE_CSS_PATH => [
            WebchatSetting::DISPLAY_NAME => 'Link to CSS file',
            WebchatSetting::DESCRIPTION => 'CSS for the full-page chatbot',
            WebchatSetting::TYPE => WebchatSetting::STRING,
            WebchatSetting::SECTION => "Custom CSS",
            WebchatSetting::SUBSECTION => 'CSS for full-page Chatbot'
        ],

        WebchatSetting::PAGE_CSS_PATH => [
            WebchatSetting::DISPLAY_NAME => 'Link to CSS file',
            WebchatSetting::DESCRIPTION => 'CSS for the page the chatbot lives on',
            WebchatSetting::TYPE => WebchatSetting::STRING,
            WebchatSetting::SECTION => "Custom CSS",
            WebchatSetting::SUBSECTION => 'CSS for page'
        ],

        WebchatSetting::CHATBOT_NAME => [
            WebchatSetting::DISPLAY_NAME => 'Name',
            WebchatSetting::DESCRIPTION => 'The chatbot name used above message bubbles, when active',
            WebchatSetting::TYPE => WebchatSetting::STRING,
            WebchatSetting::SECTION => "General Settings",
            WebchatSetting::SUBSECTION => 'Chatbot',
            WebchatSetting::SIBLING => WebchatSetting::USE_BOT_NAME
        ],

        WebchatSetting::USE_BOT_NAME => [
            WebchatSetting::DISPLAY_NAME => 'Show Name',
            WebchatSetting::DESCRIPTION => 'Whether to show the name of the chatbot above message bubbles',
            WebchatSetting::TYPE => WebchatSetting::BOOLEAN,
            WebchatSetting::SECTION => "General Settings",
            WebchatSetting::SUBSECTION => 'Chatbot',
            WebchatSetting::SIBLING => WebchatSetting::CHATBOT_NAME
        ],

        WebchatSetting::CHATBOT_AVATAR_PATH => [
            WebchatSetting::DISPLAY_NAME => 'Name',
            WebchatSetting::DESCRIPTION => 'URL of where you are hosting the avatar image for chatbot',
            WebchatSetting::TYPE => WebchatSetting::STRING,
            WebchatSetting::SECTION => "General Settings",
            WebchatSetting::SUBSECTION => 'Chatbot',
            WebchatSetting::SIBLING => WebchatSetting::USE_BOT_AVATAR
        ],

        WebchatSetting::USE_BOT_AVATAR => [
            WebchatSetting::DISPLAY_NAME => 'Show Avatar',
            WebchatSetting::DESCRIPTION => 'Whether to show the chatbot avatar',
            WebchatSetting::TYPE => WebchatSetting::BOOLEAN,
            WebchatSetting::SECTION => "General Settings",
            WebchatSetting::SUBSECTION => 'Chatbot',
            WebchatSetting::SIBLING => WebchatSetting::CHATBOT_AVATAR_PATH
        ],

        WebchatSetting::RESTART_BUTTON_CALLBACK => [
            WebchatSetting::DISPLAY_NAME => 'Name',
            WebchatSetting::DESCRIPTION => 'The chatbot name used above message bubbles, when active',
            WebchatSetting::TYPE => WebchatSetting::STRING,
            WebchatSetting::SECTION => "General Settings",
            WebchatSetting::SUBSECTION => 'Chatbot'
        ],

        WebchatSetting::NEW_USER_OPEN_CALLBACK => [
            WebchatSetting::DISPLAY_NAME => 'Name',
            WebchatSetting::DESCRIPTION => 'The chatbot name used above message bubbles, when active',
            WebchatSetting::TYPE => WebchatSetting::STRING,
            WebchatSetting::SECTION => "General Settings",
            WebchatSetting::SUBSECTION => 'Chatbot'
        ],

        WebchatSetting::RETURNING_USER_OPEN_CALLBACK => [
            WebchatSetting::DISPLAY_NAME => 'Name',
            WebchatSetting::DESCRIPTION => 'The chatbot name used above message bubbles, when active',
            WebchatSetting::TYPE => WebchatSetting::STRING,
            WebchatSetting::SECTION => "General Settings",
            WebchatSetting::SUBSECTION => 'Chatbot'
        ],

        WebchatSetting::ONGOING_USER_OPEN_CALLBACK => [
            WebchatSetting::DISPLAY_NAME => 'Name',
            WebchatSetting::DESCRIPTION => 'The chatbot name used above message bubbles, when active',
            WebchatSetting::TYPE => WebchatSetting::STRING,
            WebchatSetting::SECTION => "General Settings",
            WebchatSetting::SUBSECTION => 'Chatbot'
        ],
        WebchatSetting::TYPING_INDICATOR_STYLE => [
            WebchatSetting::DISPLAY_NAME => 'Name',
            WebchatSetting::DESCRIPTION => 'The chatbot name used above message bubbles, when active',
            WebchatSetting::TYPE => WebchatSetting::STRING,
            WebchatSetting::SECTION => "General Settings",
            WebchatSetting::SUBSECTION => 'Chatbot'
        ],

        WebchatSetting::FORM_RESPONSE_TEXT => [
            WebchatSetting::DISPLAY_NAME => 'Name',
            WebchatSetting::DESCRIPTION => 'The chatbot name used above message bubbles, when active',
            WebchatSetting::TYPE => WebchatSetting::STRING,
            WebchatSetting::SECTION => "General Settings",
            WebchatSetting::SUBSECTION => 'Chatbot'
        ],

        WebchatSetting::OPEN => [
            WebchatSetting::DISPLAY => false,
            WebchatSetting::TYPE => WebchatSetting::BOOLEAN,
        ],
        WebchatSetting::HIDE_DATETIME_MESSAGE => [
            WebchatSetting::TYPE => WebchatSetting::BOOLEAN,
        ],
        WebchatSetting::HIDE_MESSAGE_TIME => [
            WebchatSetting::TYPE => WebchatSetting::BOOLEAN,
        ],
        WebchatSetting::DISABLE_CLOSE_CHAT => [
            WebchatSetting::TYPE => WebchatSetting::BOOLEAN,
        ],
        WebchatSetting::START_MINIMIZED => [
            WebchatSetting::TYPE => WebchatSetting::BOOLEAN,
        ],
        WebchatSetting::USE_HUMAN_AVATAR => [
            WebchatSetting::TYPE => WebchatSetting::BOOLEAN,
        ],
        WebchatSetting::USE_HUMAN_NAME => [
            WebchatSetting::TYPE => WebchatSetting::BOOLEAN,
        ],
        WebchatSetting::COLLECT_USER_IP => [
            WebchatSetting::TYPE => WebchatSetting::BOOLEAN,
        ],
        WebchatSetting::SHOW_RESTART_BUTTON => [
            WebchatSetting::TYPE => WebchatSetting::BOOLEAN,
        ],
        WebchatSetting::SHOW_HEADER_CLOSE_BUTTON => [
            WebchatSetting::TYPE => WebchatSetting::BOOLEAN,
        ],
        WebchatSetting::SHOW_HEADER_BUTTONS_ON_FULL_PAGE_MESSAGES => [
            WebchatSetting::TYPE => WebchatSetting::BOOLEAN,
        ],
        WebchatSetting::MESSAGE_ANIMATION => [
            WebchatSetting::TYPE => WebchatSetting::BOOLEAN,
        ],
        WebchatSetting::HIDE_TYPING_INDICATOR_ON_INTERNAL_MESSAGES => [
            WebchatSetting::TYPE => WebchatSetting::BOOLEAN,
        ],
        WebchatSetting::SHOW_TEXT_INPUT_WITH_EXTERNAL_BUTTONS => [
            WebchatSetting::TYPE => WebchatSetting::BOOLEAN,
        ],
        WebchatSetting::NEW_USER_START_MINIMIZED => [
            WebchatSetting::TYPE => WebchatSetting::BOOLEAN,
        ],
        WebchatSetting::RETURNING_USER_START_MINIMIZED => [
            WebchatSetting::TYPE => WebchatSetting::BOOLEAN,
        ],
        WebchatSetting::ONGOING_USER_START_MINIMIZED => [
            WebchatSetting::TYPE => WebchatSetting::BOOLEAN,
        ],
        WebchatSetting::SCROLL_TO_FIRST_NEW_MESSAGE => [
            WebchatSetting::TYPE => WebchatSetting::BOOLEAN,
        ],

        WebchatSetting::MESSAGE_DELAY => [
            WebchatSetting::TYPE => WebchatSetting::NUMBER,
        ],

        WebchatSetting::VALID_PATH => [
            WebchatSetting::TYPE => WebchatSetting::MAP,
        ],

        WebchatSetting::CALLBACK_MAP => [
            WebchatSetting::TYPE => WebchatSetting::MAP,
        ],
    ],
    WebchatSetting::COLOURS => [
        WebchatSetting::HEADER_BACKGROUND => [
            WebchatSetting::TYPE => WebchatSetting::COLOUR,
            WebchatSetting::DISPLAY_NAME => '',
            WebchatSetting::DESCRIPTION => '',
        ],
        WebchatSetting::HEADER_TEXT => [
            WebchatSetting::TYPE => WebchatSetting::COLOUR,
            WebchatSetting::DISPLAY_NAME => '',
            WebchatSetting::DESCRIPTION => '',
        ],
        WebchatSetting::LAUNCHER_BACKGROUND => [
            WebchatSetting::TYPE => WebchatSetting::COLOUR,
            WebchatSetting::DISPLAY_NAME => '',
            WebchatSetting::DESCRIPTION => '',
        ],
        WebchatSetting::MESSAGE_LIST_BACKGROUND => [
            WebchatSetting::TYPE => WebchatSetting::COLOUR,
            WebchatSetting::DISPLAY_NAME => '',
            WebchatSetting::DESCRIPTION => '',
        ],
        WebchatSetting::SENT_MESSAGE_BACKGROUND => [
            WebchatSetting::TYPE => WebchatSetting::COLOUR,
            WebchatSetting::DISPLAY_NAME => '',
            WebchatSetting::DESCRIPTION => '',
        ],
        WebchatSetting::SENT_MESSAGE_TEXT => [
            WebchatSetting::TYPE => WebchatSetting::COLOUR,
            WebchatSetting::DISPLAY_NAME => '',
            WebchatSetting::DESCRIPTION => '',
        ],
        WebchatSetting::RECEIVED_MESSAGE_BACKGROUND => [
            WebchatSetting::TYPE => WebchatSetting::COLOUR,
            WebchatSetting::DISPLAY_NAME => '',
            WebchatSetting::DESCRIPTION => '',
        ],
        WebchatSetting::RECEIVED_MESSAGE_TEXT => [
            WebchatSetting::TYPE => WebchatSetting::COLOUR,
            WebchatSetting::DISPLAY_NAME => '',
            WebchatSetting::DESCRIPTION => '',
        ],
        WebchatSetting::USER_INPUT_BACKGROUND => [
            WebchatSetting::TYPE => WebchatSetting::COLOUR,
            WebchatSetting::DISPLAY_NAME => '',
            WebchatSetting::DESCRIPTION => '',
        ],
        WebchatSetting::USER_INPUT_TEXT => [
            WebchatSetting::TYPE => WebchatSetting::COLOUR,
            WebchatSetting::DISPLAY_NAME => '',
            WebchatSetting::DESCRIPTION => '',
        ],
        WebchatSetting::ICON_BACKGROUND => [
            WebchatSetting::TYPE => WebchatSetting::COLOUR,
            WebchatSetting::DISPLAY_NAME => '',
            WebchatSetting::DESCRIPTION => '',
        ],
        WebchatSetting::ICON_HOVER_BACKGROUND => [
            WebchatSetting::TYPE => WebchatSetting::COLOUR,
            WebchatSetting::DISPLAY_NAME => '',
            WebchatSetting::DESCRIPTION => '',
        ],
        WebchatSetting::BUTTON_BACKGROUND => [
            WebchatSetting::TYPE => WebchatSetting::COLOUR,
            WebchatSetting::DISPLAY_NAME => '',
            WebchatSetting::DESCRIPTION => '',
        ],
        WebchatSetting::BUTTON_HOVER_BACKGROUND => [
            WebchatSetting::TYPE => WebchatSetting::COLOUR,
            WebchatSetting::DISPLAY_NAME => '',
            WebchatSetting::DESCRIPTION => '',
        ],
        WebchatSetting::BUTTON_TEXT => [
            WebchatSetting::TYPE => WebchatSetting::COLOUR,
            WebchatSetting::DISPLAY_NAME => '',
            WebchatSetting::DESCRIPTION => '',
        ],
        WebchatSetting::EXTERNAL_BUTTON_BACKGROUND => [
            WebchatSetting::TYPE => WebchatSetting::COLOUR,
            WebchatSetting::DISPLAY_NAME => '',
            WebchatSetting::DESCRIPTION => '',
        ],
        WebchatSetting::EXTERNAL_BUTTON_HOVER_BACKGROUND => [
            WebchatSetting::TYPE => WebchatSetting::COLOUR,
            WebchatSetting::DISPLAY_NAME => '',
            WebchatSetting::DESCRIPTION => '',
        ],
        WebchatSetting::EXTERNAL_BUTTON_TEXT => [
            WebchatSetting::TYPE => WebchatSetting::COLOUR,
            WebchatSetting::DISPLAY_NAME => '',
            WebchatSetting::DESCRIPTION => '',
        ],
    ],
    WebchatSetting::COMMENTS => [
        WebchatSetting::COMMENTS_ENABLED => [
            WebchatSetting::TYPE => WebchatSetting::BOOLEAN,
            WebchatSetting::DISPLAY => false
        ],
        WebchatSetting::COMMENTS_NAME => [
            WebchatSetting::TYPE => WebchatSetting::STRING,
            WebchatSetting::DISPLAY => false
        ],
        WebchatSetting::COMMENTS_ENABLED_PATH_PATTERN => [
            WebchatSetting::TYPE => WebchatSetting::STRING,
            WebchatSetting::DISPLAY => false
        ],
        WebchatSetting::COMMENTS_ENTITY_NAME => [
            WebchatSetting::TYPE => WebchatSetting::STRING,
            WebchatSetting::DISPLAY => false
        ],
        WebchatSetting::COMMENTS_CREATED_FIELDNAME => [
            WebchatSetting::TYPE => WebchatSetting::STRING,
            WebchatSetting::DISPLAY => false
        ],
        WebchatSetting::COMMENTS_TEXT_FIELDNAME => [
            WebchatSetting::TYPE => WebchatSetting::STRING,
            WebchatSetting::DISPLAY => false
        ],
        WebchatSetting::COMMENTS_ENDPOINT => [
            WebchatSetting::TYPE => WebchatSetting::STRING,
            WebchatSetting::DISPLAY => false
        ],
        WebchatSetting::COMMENTS_AUTH_TOKEN => [
            WebchatSetting::TYPE => WebchatSetting::STRING,
            WebchatSetting::DISPLAY => false
        ],
        WebchatSetting::COMMENTS_AUTHOR_ENTITY_NAME => [
            WebchatSetting::TYPE => WebchatSetting::STRING,
            WebchatSetting::DISPLAY => false
        ],
        WebchatSetting::COMMENTS_AUTHOR_RELATIONSHIP_NAME => [
            WebchatSetting::TYPE => WebchatSetting::STRING,
            WebchatSetting::DISPLAY => false
        ],
        WebchatSetting::COMMENTS_AUTHOR_ID_FIELDNAME => [
            WebchatSetting::TYPE => WebchatSetting::STRING,
            WebchatSetting::DISPLAY => false
        ],
        WebchatSetting::COMMENTS_AUTHOR_NAME_FIELDNAME => [
            WebchatSetting::TYPE => WebchatSetting::STRING,
            WebchatSetting::DISPLAY => false
        ],
        WebchatSetting::COMMENTS_SECTION_ENTITY_NAME => [
            WebchatSetting::TYPE => WebchatSetting::STRING,
            WebchatSetting::DISPLAY => false
        ],
        WebchatSetting::COMMENTS_SECTION_RELATIONSHIP_NAME => [
            WebchatSetting::TYPE => WebchatSetting::STRING,
            WebchatSetting::DISPLAY => false
        ],
        WebchatSetting::COMMENTS_SECTION_ID_FIELDNAME => [
            WebchatSetting::TYPE => WebchatSetting::STRING,
            WebchatSetting::DISPLAY => false
        ],
        WebchatSetting::COMMENTS_SECTION_NAME_FIELDNAME => [
            WebchatSetting::TYPE => WebchatSetting::STRING,
            WebchatSetting::DISPLAY => false
        ],
        WebchatSetting::COMMENTS_SECTION_FILTER_PATH_PATTERN => [
            WebchatSetting::TYPE => WebchatSetting::STRING,
            WebchatSetting::DISPLAY => false
        ],
        WebchatSetting::COMMENTS_SECTION_FILTER_QUERY => [
            WebchatSetting::TYPE => WebchatSetting::STRING,
            WebchatSetting::DISPLAY => false
        ],
        WebchatSetting::COMMENTS_SECTION_PATH_PATTERN => [
            WebchatSetting::TYPE => WebchatSetting::STRING,
            WebchatSetting::DISPLAY => false
        ],
    ],
    WebchatSetting::WEBCHAT_HISTORY => [
        WebchatSetting::SHOW_HISTORY => [
            WebchatSetting::TYPE => WebchatSetting::BOOLEAN,
            WebchatSetting::DISPLAY_NAME => 'Show Previous Messages',
            WebchatSetting::DESCRIPTION => 'Toggle chat history being shown when the chatbot loads',
            WebchatSetting::SECTION => 'Conversational History Settings',
            WebchatSetting::SUBSECTION => 'In-chat conversational history',
        ],
        WebchatSetting::NUMBER_OF_MESSAGES => [
            WebchatSetting::TYPE => WebchatSetting::NUMBER,
            WebchatSetting::DISPLAY_NAME => 'Number of previous messages shown in chat',
            WebchatSetting::DESCRIPTION => 'Number of previous messages shown in chat',
            WebchatSetting::SECTION => 'Conversational History Settings',
            WebchatSetting::SUBSECTION => 'In-chat conversational history',
        ],
    ],
];
