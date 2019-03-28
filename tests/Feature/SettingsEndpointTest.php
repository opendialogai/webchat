<?php

namespace OpenDialogAi\Webchat\Tests\Feature;

use Illuminate\Foundation\Testing\WithoutMiddleware;
use OpenDialogAi\Webchat\Tests\TestCase;
use OpenDialogAi\Webchat\WebchatSetting;
use OpenDialogAi\Webchat\Http\Controllers\WebchatSettings;

class SettingsEndpointTest extends TestCase
{
    public function testSettingsApi()
    {
        $setting = new WebchatSetting();
        $setting->name = 'teamName';
        $setting->value = 'OpenDialog Webchat';
        $setting->type = 'string';
        $setting->save();

        $setting2 = new WebchatSetting();
        $setting2->name = 'open';
        $setting2->value = TRUE;
        $setting2->type = 'boolean';
        $setting2->save();

        $setting3 = new WebchatSetting();
        $setting3->name = 'colours';
        $setting3->value = 'colours';
        $setting3->type = 'object';
        $setting3->save();

        $setting4 = new WebchatSetting();
        $setting4->name = 'headerBackground';
        $setting4->value = '#ffffff';
        $setting4->type = 'colour';
        $setting4->parent_id = $setting3->id;
        $setting4->save();

        $setting5 = new WebchatSetting();
        $setting5->name = 'headerText';
        $setting5->value = '#000000';
        $setting5->type = 'colour';
        $setting5->parent_id = $setting3->id;
        $setting5->save();

        $setting6 = new WebchatSetting();
        $setting6->name = 'comments';
        $setting6->value = 'comments';
        $setting6->type = 'object';
        $setting6->save();

        $setting7 = new WebchatSetting();
        $setting7->name = 'commentsName';
        $setting7->value = 'Comments Tab';
        $setting7->type = 'string';
        $setting7->parent_id = $setting6->id;
        $setting7->save();

        $setting8 = new WebchatSetting();
        $setting8->name = 'commentsEnabled';
        $setting8->value = FALSE;
        $setting8->type = 'boolean';
        $setting8->parent_id = $setting6->id;
        $setting8->save();

        $setting9 = new WebchatSetting();
        $setting9->name = 'messageDelay';
        $setting9->value = 1000;
        $setting9->type = 'number';
        $setting9->save();

        $response = $this->json('GET', '/webchat-config');
        $response
            ->assertStatus(200)
            ->assertJson([
                'teamName' => 'OpenDialog Webchat',
                'open' => true,
                'colours' => [
                    'headerBackground' => '#ffffff',
                    'headerText' => '#000000',
                ],
                'comments' => [
                    'commentsName' => 'Comments Tab',
                    'commentsEnabled' => false,
                ],
                'messageDelay' => 1000,
            ], TRUE);
    }
}
