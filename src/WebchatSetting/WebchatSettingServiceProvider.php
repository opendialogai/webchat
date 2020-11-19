<?php

namespace OpenDialogAi\Webchat\WebchatSetting;

use Illuminate\Support\Arr;
use Illuminate\Support\ServiceProvider;

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
        $this->mergeConfigFrom(__DIR__ . '/config/opendialog-webchatsetting.php', 'opendialog.webchat_setting');
    }

    protected function mergeConfigFrom($path, $key)
    {
        if (! $this->app->configurationIsCached()) {
            $this->app['config']->set($key, $this->recursiveMergeConfigFrom(
                require $path,
                $this->app['config']->get($key, [])
            ));
        }
    }

    /**
     * From: https://gist.github.com/koenhoeijmakers/0a8e326ee3b12a826d73be38693fb647
     *
     * @param array $original
     * @param array $merging
     * @return array
     */
    private function recursiveMergeConfigFrom(array $original, array $merging)
    {
        $array = array_merge($original, $merging);

        foreach ($original as $key => $value) {
            if (!is_array($value)) {
                continue;
            }

            if (!Arr::exists($merging, $key)) {
                continue;
            }

            if (is_numeric($key)) {
                continue;
            }

            $array[$key] = $this->recursiveMergeConfigFrom($value, $merging[$key]);
        }

        return $array;
    }
}
