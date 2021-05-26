<?php

namespace OpenDialogAi\Webchat\WebchatSetting\Service;

use Illuminate\Support\Arr;

class WebchatSettingService implements WebchatSettingServiceInterface
{
    public function mergeConfigFrom($path, $key): void
    {
        if (! app()->configurationIsCached()) {
            config([
                $key => $this->recursiveMergeConfigFrom(
                    require $path,
                    config($key, [])
                )
            ]);
        }
    }

    /**
     * @param array $original
     * @param array $merging
     * @return array
     */
    private function recursiveMergeConfigFrom(array $original, array $merging)
    {
        $array = array_merge($original, $merging);

        foreach ($merging as $key => $value) {
            if (Arr::exists($original, $key)) {
                $array[$key] = array_merge($original[$key], $merging[$key]);
            }
        }

        return $array;
    }
}
