<?php


namespace OpenDialogAi\Webchat\Tests\Unit;


use OpenDialogAi\Webchat\Tests\TestCase;
use OpenDialogAi\Webchat\WebchatSetting;
use OpenDialogAi\Webchat\WebchatSetting\Service\WebchatSettingServiceInterface;

class WebchatSettingServiceTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();
    }

    public function testSettingOverlay()
    {
        $settings = config('opendialog.webchat_setting');
        $this->assertArrayHasKey(WebchatSetting::GENERAL, $settings);
        $this->assertArrayHasKey(WebchatSetting::STRING, $settings[WebchatSetting::GENERAL]);
        $this->assertNotContains('myCustomSetting1', $settings[WebchatSetting::GENERAL][WebchatSetting::STRING]);
        $this->assertNotContains('myCustomSetting2', $settings[WebchatSetting::GENERAL][WebchatSetting::STRING]);
        $this->assertArrayHasKey(WebchatSetting::BOOLEAN, $settings[WebchatSetting::GENERAL]);
        $this->assertNotContains('myCustomSetting3', $settings[WebchatSetting::GENERAL][WebchatSetting::BOOLEAN]);

        resolve(WebchatSettingServiceInterface::class)->mergeConfigFrom(
            __DIR__ . '/Example/opendialog-webchatsetting-custom.php',
            'opendialog.webchat_setting'
        );

        $settings = config('opendialog.webchat_setting');

        $this->assertArrayHasKey(WebchatSetting::GENERAL, $settings);
        $this->assertArrayHasKey(WebchatSetting::STRING, $settings[WebchatSetting::GENERAL]);
        $this->assertContains('myCustomSetting1', $settings[WebchatSetting::GENERAL][WebchatSetting::STRING]);
        $this->assertContains('myCustomSetting2', $settings[WebchatSetting::GENERAL][WebchatSetting::STRING]);
        $this->assertArrayHasKey(WebchatSetting::BOOLEAN, $settings[WebchatSetting::GENERAL]);
        $this->assertContains('myCustomSetting3', $settings[WebchatSetting::GENERAL][WebchatSetting::BOOLEAN]);
    }
}
