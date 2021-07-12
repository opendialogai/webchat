<?php

use OpenDialogAi\Webchat\WebchatSetting;

return [
    WebchatSetting::GENERAL => [
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
            WebchatSetting::DISPLAY_NAME => 'Avatar Image URL',
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

        WebchatSetting::HIDE_DATETIME_MESSAGE => [
            WebchatSetting::DISPLAY_NAME => 'Hide Message DateTime (eg 11:15)',
            WebchatSetting::DESCRIPTION => 'Whether to hide the time in the chatbot',
            WebchatSetting::TYPE => WebchatSetting::BOOLEAN,
            WebchatSetting::SECTION => "General Settings",
            WebchatSetting::SUBSECTION => 'Messages',
            WebchatSetting::DISPLAY => false,
        ],

        WebchatSetting::HIDE_MESSAGE_TIME => [
            WebchatSetting::DISPLAY_NAME => 'Hide Message Time (eg 11:15)',
            WebchatSetting::DESCRIPTION => 'Whether to hide the time in the chatbot',
            WebchatSetting::TYPE => WebchatSetting::BOOLEAN,
            WebchatSetting::SECTION => "General Settings",
            WebchatSetting::SUBSECTION => 'Messages',
        ],

        WebchatSetting::MESSAGE_DELAY => [
            WebchatSetting::TYPE => WebchatSetting::NUMBER,
            WebchatSetting::SECTION => 'General Settings',
            WebchatSetting::SUBSECTION => 'Typing Event',
            WebchatSetting::DISPLAY_NAME => 'Timing',
            WebchatSetting::DESCRIPTION => 'This is the duration in seconds, during which a typing event shows between messages'
        ],

        WebchatSetting::HIDE_TYPING_INDICATOR_ON_INTERNAL_MESSAGES => [
            WebchatSetting::TYPE => WebchatSetting::BOOLEAN,
            WebchatSetting::SECTION => 'General Settings',
            WebchatSetting::SUBSECTION => 'Typing Event',
            WebchatSetting::DISPLAY_NAME => 'Hide Typing Indicator between messages',
            WebchatSetting::DESCRIPTION => 'Whether to hide the typing indicator in between bot messages'
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
            WebchatSetting::SUBSECTION => 'CSS for full-page Chatbot',
            WebchatSetting::DISPLAY => false
        ],

        WebchatSetting::PAGE_CSS_PATH => [
            WebchatSetting::DISPLAY_NAME => 'Link to CSS file',
            WebchatSetting::DESCRIPTION => 'CSS for the page the chatbot lives on',
            WebchatSetting::TYPE => WebchatSetting::STRING,
            WebchatSetting::SECTION => "Custom CSS",
            WebchatSetting::SUBSECTION => 'CSS for page'
        ],

        WebchatSetting::USE_HUMAN_AVATAR => [
            WebchatSetting::DISPLAY_NAME => 'Show User Avatar',
            WebchatSetting::DESCRIPTION => 'Whether to show the initials of the user in a generated avatar',
            WebchatSetting::TYPE => WebchatSetting::BOOLEAN,
            WebchatSetting::DISPLAY => false

        ],
        WebchatSetting::USE_HUMAN_NAME => [
            WebchatSetting::TYPE => WebchatSetting::BOOLEAN,
            WebchatSetting::DISPLAY_NAME => 'Show user name',
            WebchatSetting::DESCRIPTION => 'Whether to show name of the user above messages',
            WebchatSetting::DISPLAY => false
        ],
        WebchatSetting::COLLECT_USER_IP => [
            WebchatSetting::TYPE => WebchatSetting::BOOLEAN,
            WebchatSetting::DISPLAY_NAME => 'Show user name',
            WebchatSetting::DESCRIPTION => 'Whether to show name of the user above messages',
            WebchatSetting::DISPLAY => false
        ],
        WebchatSetting::SHOW_RESTART_BUTTON => [
            WebchatSetting::TYPE => WebchatSetting::BOOLEAN,
            WebchatSetting::SECTION => 'General Settings',
            WebchatSetting::SUBSECTION => 'Chatbot Controls',
            WebchatSetting::DISPLAY_NAME => 'Show Restart Button',
            WebchatSetting::DESCRIPTION => 'Whether to show the restart button in the chatbot header',
        ],
        WebchatSetting::SHOW_END_CHAT_BUTON => [
            WebchatSetting::TYPE => WebchatSetting::BOOLEAN,
            WebchatSetting::SECTION => 'General Settings',
            WebchatSetting::SUBSECTION => 'Chatbot Controls',
            WebchatSetting::DISPLAY_NAME => 'Show Chat End Button',
            WebchatSetting::DESCRIPTION => 'Whether to show name the Chat End button in the chatbot footer',
        ],
        WebchatSetting::SHOW_DOWNLOAD_BUTON => [
            WebchatSetting::TYPE => WebchatSetting::BOOLEAN,
            WebchatSetting::SECTION => 'General Settings',
            WebchatSetting::SUBSECTION => 'Chatbot Controls',
            WebchatSetting::DISPLAY_NAME => 'Show Download Button',
            WebchatSetting::DESCRIPTION => 'Whether to show name the download button in the chatbot header',
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
        WebchatSetting::SHOW_TEXT_INPUT_WITH_EXTERNAL_BUTTONS => [
            WebchatSetting::TYPE => WebchatSetting::BOOLEAN,
        ],
        WebchatSetting::NEW_USER_START_MINIMIZED => [
            WebchatSetting::TYPE => WebchatSetting::BOOLEAN,
            WebchatSetting::SECTION => 'General Settings',
            WebchatSetting::SUBSECTION => 'Start Options',
            WebchatSetting::DISPLAY_NAME => 'Start Minimized For New Users',
            WebchatSetting::DESCRIPTION => 'Whether the chatbot starts minimized for new users we\' never seen before',
        ],
        WebchatSetting::RETURNING_USER_START_MINIMIZED => [
            WebchatSetting::TYPE => WebchatSetting::BOOLEAN,
            WebchatSetting::SECTION => 'General Settings',
            WebchatSetting::SUBSECTION => 'Start Options',
            WebchatSetting::DISPLAY_NAME => 'Start Minimized For Returning Users',
            WebchatSetting::DESCRIPTION =>
                'Whether the chatbot starts minimized for users we\'ve seen before but aren\'t in a conversation',
        ],
        WebchatSetting::ONGOING_USER_START_MINIMIZED => [
            WebchatSetting::TYPE => WebchatSetting::BOOLEAN,
            WebchatSetting::SECTION => 'General Settings',
            WebchatSetting::SUBSECTION => 'Start Options',
            WebchatSetting::DISPLAY_NAME => 'Start Minimized For Ongoing Users',
            WebchatSetting::DESCRIPTION => 'Whether the chatbot starts minimized for users who are mid-conversation',
        ],
        WebchatSetting::SCROLL_TO_FIRST_NEW_MESSAGE => [
            WebchatSetting::TYPE => WebchatSetting::BOOLEAN,
        ],

        WebchatSetting::VALID_PATH => [
            WebchatSetting::TYPE => WebchatSetting::MAP,
        ],

        WebchatSetting::CALLBACK_MAP => [
            WebchatSetting::DISPLAY_NAME => 'Callback Map',
            WebchatSetting::DESCRIPTION => 'A map of URL to callback. Allows a custom callback to be sent on some URLs',
            WebchatSetting::TYPE => WebchatSetting::MAP,
            WebchatSetting::DISPLAY => false,
        ],

        WebchatSetting::URL => [
            WebchatSetting::DISPLAY_NAME => 'URL',
            WebchatSetting::DESCRIPTION => 'The URL the bot is hosted at',
            WebchatSetting::TYPE => WebchatSetting::STRING,
            WebchatSetting::DISPLAY => false,
        ],

        WebchatSetting::RESTART_BUTTON_CALLBACK => [
            WebchatSetting::DISPLAY_NAME => 'Restart Button Callback',
            WebchatSetting::DESCRIPTION => 'What callback is sent when the restart button is clicked',
            WebchatSetting::TYPE => WebchatSetting::STRING,
            WebchatSetting::DISPLAY => false
        ],

        WebchatSetting::NEW_USER_OPEN_CALLBACK => [
            WebchatSetting::DISPLAY_NAME => 'The callback sent when a new user opens the bot',
            WebchatSetting::DESCRIPTION => 'The chatbot name used above message bubbles, when active',
            WebchatSetting::TYPE => WebchatSetting::STRING,
            WebchatSetting::DISPLAY => false
        ],

        WebchatSetting::RETURNING_USER_OPEN_CALLBACK => [
            WebchatSetting::DISPLAY_NAME => 'Returning user callback',
            WebchatSetting::DESCRIPTION => 'The callback sent when a returning user opens the bot',
            WebchatSetting::TYPE => WebchatSetting::STRING,
            WebchatSetting::DISPLAY => false
        ],

        WebchatSetting::ONGOING_USER_OPEN_CALLBACK => [
            WebchatSetting::DISPLAY_NAME => 'Ongoing user callback',
            WebchatSetting::DESCRIPTION => 'The callback sent when an ongoing user opens the bot',
            WebchatSetting::TYPE => WebchatSetting::STRING,
            WebchatSetting::DISPLAY => false
        ],

        WebchatSetting::TYPING_INDICATOR_STYLE => [
            WebchatSetting::DISPLAY_NAME => 'Typing Indicator Style',
            WebchatSetting::DESCRIPTION => 'What style of typing indicator to use - supported types are `typewritter` or `blobs`',
            WebchatSetting::TYPE => WebchatSetting::STRING,
            WebchatSetting::DISPLAY => false
        ],

        WebchatSetting::FORM_RESPONSE_TEXT => [
            WebchatSetting::DISPLAY_NAME => 'Form Response Text',
            WebchatSetting::DESCRIPTION =>
                'The text to show when a user submits a form. If blank, the values entered in the form will be shown',
            WebchatSetting::TYPE => WebchatSetting::STRING,
            WebchatSetting::DISPLAY => false
        ],

        WebchatSetting::OPEN => [
            WebchatSetting::TYPE => WebchatSetting::BOOLEAN,
            WebchatSetting::DISPLAY_NAME => 'Open',
            WebchatSetting::DESCRIPTION => 'This currently has no affect',
            WebchatSetting::DISPLAY => false,
        ],

        WebchatSetting::DISABLE_CLOSE_CHAT => [
            WebchatSetting::DISPLAY_NAME => 'Disable Chat Close button',
            WebchatSetting::DESCRIPTION => 'If true, prevents the chatbot being closed',
            WebchatSetting::TYPE => WebchatSetting::BOOLEAN,
            WebchatSetting::DISPLAY => false
        ],
    ],
    WebchatSetting::COLOURS => [
        WebchatSetting::HEADER_BACKGROUND => [
            WebchatSetting::TYPE => WebchatSetting::COLOUR,
            WebchatSetting::DISPLAY_NAME => 'Background Colour',
            WebchatSetting::DESCRIPTION => '',
            WebchatSetting::SECTION => "Layout Settings",
            WebchatSetting::SUBSECTION => 'Launcher & Header',
        ],
        WebchatSetting::HEADER_TEXT => [
            WebchatSetting::TYPE => WebchatSetting::COLOUR,
            WebchatSetting::DISPLAY_NAME => 'Title Text Colour',
            WebchatSetting::DESCRIPTION => '',
            WebchatSetting::SECTION => "Layout Settings",
            WebchatSetting::SUBSECTION => 'Launcher & Header',
        ],

        WebchatSetting::MESSAGE_LIST_BACKGROUND => [
            WebchatSetting::TYPE => WebchatSetting::COLOUR,
            WebchatSetting::DISPLAY_NAME => 'Background Colour',
            WebchatSetting::DESCRIPTION => '',
            WebchatSetting::SECTION => "Layout Settings",
            WebchatSetting::SUBSECTION => 'Chat Window',
        ],

        WebchatSetting::USER_INPUT_BACKGROUND => [
            WebchatSetting::TYPE => WebchatSetting::COLOUR,
            WebchatSetting::DISPLAY_NAME => 'Background Colour',
            WebchatSetting::DESCRIPTION => '',
            WebchatSetting::SECTION => "Layout Settings",
            WebchatSetting::SUBSECTION => 'User Input Field',
        ],
        WebchatSetting::USER_INPUT_TEXT => [
            WebchatSetting::TYPE => WebchatSetting::COLOUR,
            WebchatSetting::DISPLAY_NAME => 'Text Colour',
            WebchatSetting::DESCRIPTION => '',
            WebchatSetting::SECTION => "Layout Settings",
            WebchatSetting::SUBSECTION => 'User Input Field',
        ],

        WebchatSetting::RECEIVED_MESSAGE_BACKGROUND => [
            WebchatSetting::TYPE => WebchatSetting::COLOUR,
            WebchatSetting::DISPLAY_NAME => 'Application Messages Background Colour',
            WebchatSetting::DESCRIPTION => '',
            WebchatSetting::SECTION => "Layout Settings",
            WebchatSetting::SUBSECTION => 'Messages',
            WebchatSetting::SIBLING => WebchatSetting::SENT_MESSAGE_BACKGROUND
        ],
        WebchatSetting::SENT_MESSAGE_BACKGROUND => [
            WebchatSetting::TYPE => WebchatSetting::COLOUR,
            WebchatSetting::DISPLAY_NAME => 'User Message Background Colour',
            WebchatSetting::DESCRIPTION => '',
            WebchatSetting::SECTION => "Layout Settings",
            WebchatSetting::SUBSECTION => 'Messages',
            WebchatSetting::SIBLING => WebchatSetting::RECEIVED_MESSAGE_BACKGROUND
        ],

        WebchatSetting::RECEIVED_MESSAGE_TEXT => [
            WebchatSetting::TYPE => WebchatSetting::COLOUR,
            WebchatSetting::DISPLAY_NAME => 'Application Message Text Colour',
            WebchatSetting::DESCRIPTION => '',
            WebchatSetting::SECTION => "Layout Settings",
            WebchatSetting::SUBSECTION => 'Messages',
            WebchatSetting::SIBLING => WebchatSetting::SENT_MESSAGE_TEXT
        ],
        WebchatSetting::SENT_MESSAGE_TEXT => [
            WebchatSetting::TYPE => WebchatSetting::COLOUR,
            WebchatSetting::DISPLAY_NAME => 'User Message Text Colour',
            WebchatSetting::DESCRIPTION => '',
            WebchatSetting::SECTION => "Layout Settings",
            WebchatSetting::SUBSECTION => 'Messages',
            WebchatSetting::SIBLING => WebchatSetting::RECEIVED_MESSAGE_TEXT
        ],

        WebchatSetting::BUTTON_BACKGROUND => [
            WebchatSetting::TYPE => WebchatSetting::COLOUR,
            WebchatSetting::DISPLAY_NAME => 'Message Button Background Color',
            WebchatSetting::DESCRIPTION => '',
            WebchatSetting::SECTION => "Layout Settings",
            WebchatSetting::SUBSECTION => 'Buttons',
            WebchatSetting::SIBLING => WebchatSetting::EXTERNAL_BUTTON_BACKGROUND
        ],
        WebchatSetting::EXTERNAL_BUTTON_BACKGROUND => [
            WebchatSetting::TYPE => WebchatSetting::COLOUR,
            WebchatSetting::DISPLAY_NAME => 'External Button Background Color',
            WebchatSetting::DESCRIPTION => '',
            WebchatSetting::SECTION => "Layout Settings",
            WebchatSetting::SUBSECTION => 'Buttons',
            WebchatSetting::SIBLING => WebchatSetting::BUTTON_BACKGROUND
        ],

        WebchatSetting::BUTTON_HOVER_BACKGROUND => [
            WebchatSetting::TYPE => WebchatSetting::COLOUR,
            WebchatSetting::DISPLAY_NAME => 'Message Button Hover Color',
            WebchatSetting::DESCRIPTION => '',
            WebchatSetting::SECTION => "Layout Settings",
            WebchatSetting::SUBSECTION => 'Buttons',
            WebchatSetting::SIBLING => WebchatSetting::EXTERNAL_BUTTON_HOVER_BACKGROUND
        ],
        WebchatSetting::EXTERNAL_BUTTON_HOVER_BACKGROUND => [
            WebchatSetting::TYPE => WebchatSetting::COLOUR,
            WebchatSetting::DISPLAY_NAME => 'External Button Hover Color',
            WebchatSetting::DESCRIPTION => '',
            WebchatSetting::SECTION => "Layout Settings",
            WebchatSetting::SUBSECTION => 'Buttons',
            WebchatSetting::SIBLING => WebchatSetting::BUTTON_HOVER_BACKGROUND
        ],

        WebchatSetting::BUTTON_TEXT => [
            WebchatSetting::TYPE => WebchatSetting::COLOUR,
            WebchatSetting::DISPLAY_NAME => 'Message Button Text Color',
            WebchatSetting::DESCRIPTION => '',
            WebchatSetting::SECTION => "Layout Settings",
            WebchatSetting::SUBSECTION => 'Buttons',
            WebchatSetting::SIBLING => WebchatSetting::EXTERNAL_BUTTON_TEXT
        ],
        WebchatSetting::EXTERNAL_BUTTON_TEXT => [
            WebchatSetting::TYPE => WebchatSetting::COLOUR,
            WebchatSetting::DISPLAY_NAME => 'External Button Text Color',
            WebchatSetting::DESCRIPTION => '',
            WebchatSetting::SECTION => "Layout Settings",
            WebchatSetting::SUBSECTION => 'Buttons',
            WebchatSetting::SIBLING => WebchatSetting::BUTTON_TEXT
        ],

        // Not sure if they work
        WebchatSetting::LAUNCHER_BACKGROUND => [
            WebchatSetting::TYPE => WebchatSetting::COLOUR,
            WebchatSetting::DISPLAY_NAME => 'Background Colour',
            WebchatSetting::DESCRIPTION => '',
            WebchatSetting::DISPLAY => false
        ],
        WebchatSetting::ICON_BACKGROUND => [
            WebchatSetting::TYPE => WebchatSetting::COLOUR,
            WebchatSetting::DISPLAY_NAME => '',
            WebchatSetting::DESCRIPTION => '',
            WebchatSetting::DISPLAY => false
        ],
        WebchatSetting::ICON_HOVER_BACKGROUND => [
            WebchatSetting::TYPE => WebchatSetting::COLOUR,
            WebchatSetting::DISPLAY_NAME => '',
            WebchatSetting::DESCRIPTION => '',
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
];
