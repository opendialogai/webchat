<?php

namespace OpenDialogAi\Webchat\WebchatSetting\Service;

class WebchatSettingService implements WebchatSettingServiceInterface
{
    public function mergeConfigFrom($path, $key): void
    {
        if (! app()->configurationIsCached()) {
            app()['config']->set($key, $this->recursiveMergeConfigFrom(
                require $path,
                app()['config']->get($key, [])
            ));
        }
    }
}
