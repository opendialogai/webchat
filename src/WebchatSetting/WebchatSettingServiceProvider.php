<?php

namespace OpenDialogAi\Webchat\WebchatSetting;

use Illuminate\Support\ServiceProvider;
use OpenDialogAi\Webchat\WebchatSetting\Service\WebchatSettingService;
use OpenDialogAi\Webchat\WebchatSetting\Service\WebchatSettingServiceInterface;

class WebchatSettingServiceProvider extends ServiceProvider
{
    public function boot()
    {
        $this->publishes([
            __DIR__ . '/config/opendialog-webchatsetting-custom.php' => config_path('opendialog/webchat_setting.php')
        ], 'opendialog-config');
    }

    public function register()
    {
        $this->app->bind(WebchatSettingServiceInterface::class, function () {
            return new WebchatSettingService();
        });

        $this->mergeConfigFrom(__DIR__ . '/config/opendialog-webchatsetting.php', 'opendialog.webchat_setting');
    }

    public function mergeConfigFrom($path, $key)
    {
        resolve(WebchatSettingServiceInterface::class)->mergeConfigFrom($path, $key);
    }
}
