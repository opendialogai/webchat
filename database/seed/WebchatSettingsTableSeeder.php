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
                WebchatSetting::CHATBOT_AVATAR_PATH,
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
                WebchatSetting::USE_AVATARS,
            ]
        ];

        $createdItems = [];
        foreach ($settings as $type => $values) {
            foreach ($values as $subType => $value) {
                if (is_array($value) && !in_array($type, $createdItems)) {
                  $configItemId = DB::table('webchat_settings')->insertGetId([
                      'type' => is_array($value) ? WebchatSetting::OBJECT : $type,
                      'name' => is_array($value) ? $type : $value,
                      'value' => null,
                      'created_at' => now(),
                      'updated_at' => now(),
                  ]);
                  $createdItems[] = $type;
                } elseif (!is_array($value)) {
                  DB::table('webchat_settings')->insert([
                      'type' => is_array($value) ? WebchatSetting::OBJECT : $type,
                      'name' => is_array($value) ? $type : $value,
                      'value' => null,
                      'created_at' => now(),
                      'updated_at' => now(),
                  ]);
                }

                if (is_array($value)) {
                    foreach ($value as $subValue) {
                        DB::table('webchat_settings')->insert([
                            'type' => $subType,
                            'name' => $subValue,
                            'value' => null,
                            'created_at' => now(),
                            'updated_at' => now(),
                            'parent_id' => $configItemId,
                        ]);
                    }
                }
            }
        }
    }
}
