<?php

namespace OpenDialogAi\Webchat\Http\Controllers;

use Illuminate\Http\Request;
use OpenDialogAi\Webchat\WebchatSetting;

class WebchatSettings
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        // Create the config object.
        $config = [];

        // First, get all child settings.
        $parentIds = [];
        $childSettings = WebchatSetting::whereNotNull('parent_id')->get();
        foreach ($childSettings as $childSetting) {
            if (!in_array($childSetting->parent_id, $parentIds)) {
                $parentIds[] = $childSetting->parent_id;
            }
        }

        // Next, get all top level settings.
        $settings = WebchatSetting::whereNull('parent_id')->get();

        // Build the config array.
        foreach ($settings as $setting) {
            if (!in_array($setting->id, $parentIds) && !is_null($setting->value)) {
                $value = $this->castValue($setting->type, $setting->value);
                $config[$setting->name] = $value;
            } else {
                foreach ($childSettings as $idx => $childSetting) {
                    if (($childSetting->parent_id == $setting->id) && !is_null($childSetting->value)) {
                        $value = $this->castValue($childSetting->type, $childSetting->value);
                        $config[$setting->name][$childSetting->name] = $value;
                        unset($childSettings[$idx]);
                    }
                }
            }
        }

        // Return the config as JSON.
        return json_encode($config, JSON_FORCE_OBJECT);
    }

    /**
     * Handle the incoming request.
     *
     * @param string $type
     * @param string $value
     * @return mixed
     */
    private function castValue($type, $value)
    {
        switch ($type) {
            case 'number':
                $value = (int) $value;
                break;
            case 'boolean':
                $value = boolval($value);
                break;
            case 'object':
                $value = json_decode($value);
                break;
            default:
                break;
        }

        return $value;
    }
}
