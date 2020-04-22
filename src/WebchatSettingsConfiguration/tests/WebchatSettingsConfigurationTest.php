<?php

namespace OpenDialogAi\Webchat\WebchatSettingsConfiguration\Tests;


use OpenDialogAi\Webchat\WebchatSetting;
use OpenDialogAi\Webchat\WebchatSettingsConfiguration\Configurators\ExampleConfigurator;
use OpenDialogAi\Webchat\WebchatSettingsConfiguration\Service\WebchatSettingsConfigurationServiceInterface;
use OpenDialogAi\Webchat\WebchatSettingsConfiguration\WebchatSettingsConfigurationServiceProvider;

class WebchatSettingsConfigurationTest extends \Orchestra\Testbench\TestCase
{
    public function getPackageProviders($app)
    {
        return [
            WebchatSettingsConfigurationServiceProvider::class
        ];
    }

    public function testService()
    {
        $service = resolve(WebchatSettingsConfigurationServiceInterface::class);

        $settings = [];

        // Expect no change as there are no registered manipulators
        $this->assertEmpty($service->runConfigurations($settings));

        // Register the example manipulator and see change
        $service->registerConfigurators([
            ExampleConfigurator::class
        ]);
        $manipulatedSettings = $service->runConfigurations($settings);

        $this->assertNotEmpty($manipulatedSettings);
        $this->assertArrayHasKey(WebchatSetting::COLOURS, $manipulatedSettings);
    }
}
