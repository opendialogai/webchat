<?php


namespace OpenDialogAi\Webchat\WebchatSettingsConfiguration\Configurators;


use OpenDialogAi\Webchat\WebchatSetting;

class ExampleConfigurator implements WebchatSettingsConfiguratorInterface
{
    /**
     * @inheritDoc
     */
    public function configure(array $settings): array
    {
        // Make the webchat header background colour purple
        $settings[WebchatSetting::COLOURS][WebchatSetting::HEADER_BACKGROUND] = '#9932CC';

        return $settings;
    }
}
