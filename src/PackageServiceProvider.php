<?php

namespace OpenDialogAi\Webchat;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;
use OpenDialogAi\Webchat\Console\Commands\WebchatSettings;
use OpenDialogAi\Webchat\Helpers\LoggingHelper;

class PackageServiceProvider extends ServiceProvider
{
    public function boot()
    {
        $this->publishes([
            __DIR__ . '/../resources/assets' => resource_path('assets/opendialog/webchat')
        ], 'vue-components');

        $this->publishes([
            __DIR__ . '/../public' => public_path('vendor/webchat'),
            __DIR__ . '/../images/vendor' => public_path('images/vendor'),
            __DIR__ . '/../resources/images' => public_path('images/vendor/webchat/images'),
            __DIR__ . '/../resources/assets/css' => public_path('vendor/webchat/css'),
            __DIR__ . '/../resources/fonts' => public_path('vendor/webchat/fonts'),
        ], 'public');

        $this->publishes([
            __DIR__ . '/../resources/scripts' => app_path('../')
        ], 'scripts');

        $this->loadRoutesFrom(__DIR__ . '/../routes/web.php');

        $this->loadViewsFrom(__DIR__ . '/../resources/views', 'webchat');

        $this->loadMigrationsFrom(__DIR__ . '/../database/migrations');

        Log::pushProcessor(LoggingHelper::getLogUserIdProcessor());

        $this->loadWebchatConfig();

        if ($this->app->runningInConsole()) {
            $this->commands([
                WebchatSettings::class,
            ]);
        }
    }

    /**
     * Pulls in the webchat settings from the database and loads into Laravel config.
     * Will only load the settings if not running from the console
     */
    private function loadWebchatConfig()
    {
        if (!app()->runningInConsole()) {
            // Sets the url to the app url
            app()['config']->set('webchat.' . WebchatSetting::URL, config("APP_URL"));

            /** @var WebchatSetting $webchatSetting */
            foreach (WebchatSetting::all() as $webchatSetting) {
                if ($webchatSetting->value !== null) {
                    if ($webchatSetting->type == WebchatSetting::MAP) {
                        $value = json_decode($webchatSetting->value);
                    } elseif ($webchatSetting->type === WebchatSetting::NUMBER) {
                        $value = (float) $webchatSetting->value;
                    } elseif ($webchatSetting->type === WebchatSetting::BOOLEAN) {
                        $value = (bool) $webchatSetting->value;
                    } else {
                        $value = $webchatSetting->value;
                    }

                    app()['config']->set('webchat.' . $webchatSetting->name, $value);
                }
            }
        }
    }
}
