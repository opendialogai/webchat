<?php

namespace OpenDialogAi\Webchat\WebchatSettingsConfiguration;

use Illuminate\Support\ServiceProvider;
use OpenDialogAi\Webchat\WebchatSettingsConfiguration\Service\WebchatSettingsConfigurationService;
use OpenDialogAi\Webchat\WebchatSettingsConfiguration\Service\WebchatSettingsConfigurationServiceInterface;

class WebchatSettingsConfigurationServiceProvider extends ServiceProvider
{
    public function boot()
    {
        $this->publishes([
            __DIR__ . '/config/opendialog-webchat-settings-configuration.php' => config_path('opendialog/webchat_settings_configuration.php')
        ], 'opendialog-config');
    }

    public function register()
    {
        $this->app->singleton(WebchatSettingsConfigurationServiceInterface::class, function () {
            $service = new WebchatSettingsConfigurationService();

            if (config('opendialog.webchat_settings_configuration.configurators')) {
                $service->registerConfigurators(config('opendialog.webchat_settings_configuration.configurators'));
            }

            return $service;
        });
    }
}
