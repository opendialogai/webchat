<?php


namespace OpenDialogAi\Webchat\Tests\Unit;


use OpenDialogAi\Webchat\Tests\TestCase;
use OpenDialogAi\Webchat\WebchatSetting;
use OpenDialogAi\Webchat\WebchatSetting\WebchatSettingServiceProvider;

class WebchatSettingServiceTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();
    }

    public function testSettingOverlay()
    {
        resolve(WebchatSettingServiceProvider::class)->mergeConfigFrom(
            __DIR__ . '/tests/Unit/Example/opendialog-webchatsetting.php',
            'opendialog.webchat_setting'
        );

        $settings = config('opendialog.webchat_setting');
        $this->assertArrayHasKey(WebchatSetting::GENERAL, $settings);
        $this->assertArrayHasKey(WebchatSetting::STRING, $settings[WebchatSetting::GENERAL]);
        $this->assertArrayHasKey('myCustomSetting1', $settings[WebchatSetting::GENERAL][WebchatSetting::STRING]);
        $this->assertArrayHasKey('myCustomSetting2', $settings[WebchatSetting::GENERAL][WebchatSetting::STRING]);
        $this->assertArrayHasKey(WebchatSetting::BOOLEAN, $settings[WebchatSetting::GENERAL]);
        $this->assertArrayHasKey('myCustomSetting3', $settings[WebchatSetting::GENERAL][WebchatSetting::STRING]);
    }
}
