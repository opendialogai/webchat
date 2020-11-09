<?php

namespace OpenDialogAi\Webchat\Http\Controllers;

use Illuminate\Http\Request;
use OpenDialogAi\ContextEngine\Contexts\User\UserService;
use OpenDialogAi\Core\Conversation\ChatbotUser;
use OpenDialogAi\Webchat\WebchatSetting;
use OpenDialogAi\Webchat\WebchatSettingsConfiguration\Service\WebchatSettingsConfigurationPageInformation;
use OpenDialogAi\Webchat\WebchatSettingsConfiguration\Service\WebchatSettingsConfigurationServiceInterface;

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

        if ($error = $this->validateRequest($request)) {
            return response($error, 400);
        }

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

        $config[WebchatSetting::USER_TYPE] = ChatbotUser::NEW_USER;
        $config[WebchatSetting::SHOW_MINIMIZED] = false;
        $config[WebchatSetting::OPEN_INTENT] = 'WELCOME';

        $userId = $request->get('user_id') ?? null;
        try {
            $userService = resolve(UserService::class);
            $userType = $userService->getUserType($userId);
        } catch (\Exception $e) {
            $userType = ChatbotUser::NEW_USER;
        }

        $config[WebchatSetting::USER_TYPE] = $userType;

        /** @var WebchatSettingsConfigurationServiceInterface $configurationService */
        $configurationService = resolve(WebchatSettingsConfigurationServiceInterface::class);

        $pageUrl = $request->get('url') ?? $request->header('referer');

        $queryParameters = [];
        $queryParametersString = parse_url($pageUrl, PHP_URL_QUERY);

        if (!is_null($queryParametersString)) {
            $pageUrl = str_replace('?' . $queryParametersString, '', $pageUrl);
            parse_str($queryParametersString, $queryParameters);
        }

        $pageInfo = new WebchatSettingsConfigurationPageInformation($pageUrl);
        $pageInfo->setUserId($request->get('user_id') ?? null);
        $pageInfo->setWidth($request->get('width') ?? null);
        $pageInfo->setCallbackId($request->get('callback_id') ?? null);
        $pageInfo->setQueryParameters($queryParameters ?? []);
        $pageInfo->setTags($request->json('tags') ?? []);

        $settings = $configurationService->runConfigurations($config, $pageInfo);

        $general = $settings[WebchatSetting::GENERAL];

        // phpcs:disable
        switch ($userType) {
            case ChatbotUser::NEW_USER:
                $settings[WebchatSetting::SHOW_MINIMIZED] = $general[WebchatSetting::NEW_USER_START_MINIMIZED] ?? false;
                $settings[WebchatSetting::OPEN_INTENT] = $general[WebchatSetting::NEW_USER_OPEN_CALLBACK] ?? null;
                break;

            case ChatbotUser::RETURNING_USER:
                $settings[WebchatSetting::SHOW_MINIMIZED] = $general[WebchatSetting::RETURNING_USER_START_MINIMIZED] ?? false;
                $settings[WebchatSetting::OPEN_INTENT] = $general[WebchatSetting::RETURNING_USER_OPEN_CALLBACK] ?? null;
                break;

            case ChatbotUser::ONGOING_USER:
                $settings[WebchatSetting::SHOW_MINIMIZED] = $general[WebchatSetting::ONGOING_USER_START_MINIMIZED] ?? false;
                $settings[WebchatSetting::OPEN_INTENT] = $general[WebchatSetting::ONGOING_USER_OPEN_CALLBACK] ?? null;
                break;
        }
        // phpcs:enable

        // Return the config as JSON.
        return json_encode($settings);
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
                $value = (int)$value;
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

    /**
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    private function validateRequest(Request $request)
    {
        if ($request->get('width') && !is_numeric($request->get('width'))) {
            return 'Width parameter must be an integer.';
        }

        if ($request->get('url') && !filter_var($request->get('url'), FILTER_VALIDATE_URL)) {
            return 'Url parameter is not a valid URL.';
        }

        return null;
    }
}
