<?php

/**
 * Webchat settings are defined in this file (without initialising their values). Each level of the array has a meaning:
 *  - top level: The category the setting belongs to: general, colours, etc
 *    - second level: The type of the setting: string, boolean, etc
 *      - third level: The actual setting name
 */
return [
    \OpenDialogAi\Webchat\WebchatSetting::GENERAL => [
        'myCustomSetting1' => [
            'type' => 'string'
        ],
        'myCustomSetting2' => [
            'type' => 'string'
        ],
        'myCustomSetting3' => [
            'type' => 'string'
        ],
    ]
];
