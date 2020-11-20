<?php


namespace OpenDialogAi\Webchat\WebchatSetting\Service;


interface WebchatSettingServiceInterface
{
    public function mergeConfigFrom($path, $key): void;
}
