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
