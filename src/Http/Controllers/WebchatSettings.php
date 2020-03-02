<?php

namespace OpenDialogAi\Webchat\Http\Controllers;

use Illuminate\Http\Request;
use OpenDialogAi\ContextEngine\Contexts\User\UserService;
use OpenDialogAi\Core\Conversation\ChatbotUser;
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

        if ($userId = $request->get('user_id')) {
            $userService = resolve(UserService::class);
            $userType = $userService->getUserType($userId);

            $config[WebchatSetting::USER_TYPE] = $userType;

            switch ($userType) {
                case ChatbotUser::NEW_USER:
                    $config[WebchatSetting::SHOW_MINIMIZED] = $config[WebchatSetting::NEW_USER_START_MINIMIZED];
                    $config[WebchatSetting::CLOSED_INTENT] = $config[WebchatSetting::NEW_USER_CLOSED_CALLBACK];
                    $config[WebchatSetting::OPEN_INTENT] = $config[WebchatSetting::NEW_USER_OPEN_CALLBACK];
                    break;

                case ChatbotUser::RETURNING_USER:
                    $config[WebchatSetting::SHOW_MINIMIZED] = $config[WebchatSetting::RETURNING_USER_START_MINIMIZED];
                    $config[WebchatSetting::CLOSED_INTENT] = $config[WebchatSetting::RETURNING_USER_CLOSED_CALLBACK];
                    $config[WebchatSetting::OPEN_INTENT] = $config[WebchatSetting::RETURNING_USER_OPEN_CALLBACK];
                    break;

                case ChatbotUser::ONGOING_USER:
                    $config[WebchatSetting::SHOW_MINIMIZED] = $config[WebchatSetting::ONGOING_USER_START_MINIMIZED];
                    $config[WebchatSetting::CLOSED_INTENT] = $config[WebchatSetting::ONGOING_USER_CLOSED_CALLBACK];
                    $config[WebchatSetting::OPEN_INTENT] = $config[WebchatSetting::ONGOING_USER_OPEN_CALLBACK];
                    break;
            }
        }

        // Return the config as JSON.
        return json_encode($config);
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
            case 'map':
            case 'object':
                $value = json_decode($value);
                break;
            default:
                break;
        }

        return $value;
    }
}
