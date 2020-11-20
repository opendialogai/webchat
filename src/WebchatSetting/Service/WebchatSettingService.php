<?php


namespace OpenDialogAi\Webchat\WebchatSetting\Service;


class WebchatSettingService implements WebchatSettingServiceInterface
{
    public function mergeConfigFrom($path, $key): void
    {
        if (! $this->app->configurationIsCached()) {
            $this->app['config']->set($key, $this->recursiveMergeConfigFrom(
                require $path,
                $this->app['config']->get($key, [])
            ));
        }
    }
}
