<?php

namespace OpenDialogAi\Webchat\Tests\Unit;

use OpenDialogAi\Webchat\Tests\TestCase;
use OpenDialogAi\Webchat\WebchatSetting;

class WebchatSettingsCommandTest extends TestCase
{
    public function testCommandRun()
    {
        $this->app['config']->set(
            'opendialog.webchat_setting',
            [
                WebchatSetting::GENERAL => [
                    WebchatSetting::URL => [
                        WebchatSetting::DISPLAY_NAME => 'URL',
                        WebchatSetting::DISPLAY => false,
                        WebchatSetting::DESCRIPTION => 'The URL the bot is hosted at',
                        WebchatSetting::TYPE => WebchatSetting::STRING,
                    ],
                    WebchatSetting::TEAM_NAME => [
                        WebchatSetting::DISPLAY_NAME => 'Chatbot Name',
                        WebchatSetting::DESCRIPTION => 'The name displayed in the chatbot header',
                        WebchatSetting::TYPE => WebchatSetting::STRING,
                        WebchatSetting::SECTION => "General Settings",
                        WebchatSetting::SUBSECTION => 'Header',
                        WebchatSetting::SIBLING => WebchatSetting::LOGO
                    ],
                    WebchatSetting::LOGO => [
                        WebchatSetting::DISPLAY_NAME => 'Logo',
                        WebchatSetting::DESCRIPTION => 'The chatbot logo displayed in the header',
                        WebchatSetting::TYPE => WebchatSetting::STRING,
                        WebchatSetting::SECTION => "General Settings",
                        WebchatSetting::SUBSECTION => 'Header',
                        WebchatSetting::SIBLING => WebchatSetting::TEAM_NAME
                    ]
                ]
            ]
        );

        $this->artisan('webchat:settings');

        $this->assertCount(4, WebchatSetting::all());

        $this->assertDatabaseHas('webchat_settings', ['name' => 'general']);
        $this->assertDatabaseHas('webchat_settings', ['name' => 'url']);
        $this->assertDatabaseHas('webchat_settings', ['name' => 'teamName']);
        $this->assertDatabaseHas('webchat_settings', ['name' => 'logo']);

        $teamName = WebchatSetting::where('name', 'teamName')->first();
        $this->assertEquals('Chatbot Name', $teamName->display_name);
        $this->assertEquals('string', $teamName->type);
        $this->assertEquals(true, $teamName->display);
        $this->assertEquals('General Settings', $teamName->section);
        $this->assertEquals('Header', $teamName->subsection);
        $this->assertEquals('The name displayed in the chatbot header', $teamName->description);
        $this->assertEquals(1, $teamName->parent_id);
        $this->assertEquals(3, $teamName->sibling);
    }
}
