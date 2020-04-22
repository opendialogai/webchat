<?php


namespace OpenDialogAi\Webchat\WebchatSettingsConfiguration\Configurators;


interface WebchatSettingsConfiguratorInterface
{
    /**
     * @param array $settings
     * @return array
     */
    public function configure(array $settings): array;
}
