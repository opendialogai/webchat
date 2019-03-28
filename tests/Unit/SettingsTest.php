<?php

namespace OpenDialogAi\Webchat\Tests\Unit;

use Illuminate\Foundation\Testing\WithoutMiddleware;
use OpenDialogAi\Webchat\Tests\TestCase;
use OpenDialogAi\Webchat\WebchatSetting;
use OpenDialogAi\Webchat\Http\Controllers\WebchatSettings;

class SettingsTest extends TestCase
{
    public function testSettingsTable()
    {
        $setting = new WebchatSetting();
        $setting->name = 'test-name';
        $setting->value = 'test-value';
        $setting->save();

        $this->assertEquals('test-name', WebchatSetting::where('name', 'test-name')->first()->name);
    }
}
