<?php

namespace OpenDialogAi\Webchat\Database\Seed;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use OpenDialogAi\Webchat\WebchatSetting;

class WebchatSettingsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
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

        foreach ($settings as $type => $values) {
            foreach ($values as $value) {
                DB::table('webchat_settings')->insert([
                    'type' => $type,
                    'name' => $value,
                    'value' => null,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }
        }
    }
}
