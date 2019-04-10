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
        $settings = WebchatSetting::getSettings();

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
