<?php


namespace OpenDialogAi\Webchat\WebchatSettingsConfiguration\Service;


use OpenDialogAi\Webchat\WebchatSettingsConfiguration\Configurators\WebchatSettingsConfiguratorInterface;

interface WebchatSettingsConfigurationServiceInterface
{
    /**
     * @param WebchatSettingsConfiguratorInterface[] $configurators
     * @return mixed
     */
    public function registerConfigurators(array $configurators);

    /**
     * @param array $settings
     * @return array
     */
    public function runConfigurations(array $settings): array;
}
