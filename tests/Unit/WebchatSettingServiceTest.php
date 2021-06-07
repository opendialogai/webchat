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
        $this->assertNotContains('myCustomSetting1', array_keys($settings[WebchatSetting::GENERAL]));
        $this->assertNotContains('myCustomSetting2', array_keys($settings[WebchatSetting::GENERAL]));
        $this->assertNotContains('myCustomSetting3', array_keys($settings[WebchatSetting::GENERAL]));

        resolve(WebchatSettingServiceInterface::class)->mergeConfigFrom(
            __DIR__ . '/Example/opendialog-webchatsetting-custom.php',
            'opendialog.webchat_setting'
        );

        $settings = config('opendialog.webchat_setting');

        $this->assertArrayHasKey(WebchatSetting::GENERAL, $settings);

        $this->assertContains('myCustomSetting1', array_keys($settings[WebchatSetting::GENERAL]));
        $this->assertContains('myCustomSetting2', array_keys($settings[WebchatSetting::GENERAL]));
        $this->assertContains('myCustomSetting3', array_keys($settings[WebchatSetting::GENERAL]));
    }
}
