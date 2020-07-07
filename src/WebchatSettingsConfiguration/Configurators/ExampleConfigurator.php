<?php

namespace OpenDialogAi\Webchat\WebchatSettingsConfiguration\Configurators;

use OpenDialogAi\Webchat\WebchatSetting;
use OpenDialogAi\Webchat\WebchatSettingsConfiguration\Service\WebchatSettingsConfigurationPageInformation;

class ExampleConfigurator implements WebchatSettingsConfiguratorInterface
{
    /**
     * @inheritDoc
     */
    public function configure(array $settings, WebchatSettingsConfigurationPageInformation $pageInfo = null): array
    {
        // Make the webchat header background colour purple
        $settings[WebchatSetting::COLOURS][WebchatSetting::HEADER_BACKGROUND] = '#9932CC';

        return $settings;
    }
}
