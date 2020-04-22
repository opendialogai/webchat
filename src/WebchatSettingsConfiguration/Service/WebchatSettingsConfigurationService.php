<?php


namespace OpenDialogAi\Webchat\WebchatSettingsConfiguration\Service;


use OpenDialogAi\Webchat\WebchatSettingsConfiguration\Configurators\WebchatSettingsConfiguratorInterface;

class WebchatSettingsConfigurationService implements WebchatSettingsConfigurationServiceInterface
{
    /** @var WebchatSettingsConfiguratorInterface[] */
    private $configurators;

    public function __construct()
    {
        $this->configurators = [];
    }

    /**
     * @inheritDoc
     */
    public function registerConfigurators(array $configurators)
    {
        foreach ($configurators as $configurator) {
            $this->configurators[] = new $configurator;
        }
    }

    /**
     * @inheritDoc
     */
    public function runConfigurations(array $settings): array
    {
        $configuredSettings = $settings;

        /** @var WebchatSettingsConfiguratorInterface $configurator */
        foreach ($this->configurators as $configurator) {
            $configuredSettings = $configurator->configure($configuredSettings);
        }

        return $configuredSettings;
    }
}
