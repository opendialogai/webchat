<?php


namespace OpenDialogAi\Webchat\WebchatSettingsConfiguration\Configurators;


use OpenDialogAi\Webchat\WebchatSettingsConfiguration\Service\WebchatSettingsConfigurationPageInformation;

interface WebchatSettingsConfiguratorInterface
{
    /**
     * @param array $settings
     * @param WebchatSettingsConfigurationPageInformation $pageInfo
     * @return array
     */
    public function configure(array $settings, WebchatSettingsConfigurationPageInformation $pageInfo = null): array;
}
