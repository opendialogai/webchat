<?php

namespace OpenDialogAi\Webchat\Tests\Feature;

use Mockery;
use OpenDialogAi\ContextEngine\Contexts\User\UserService;
use OpenDialogAi\Webchat\Tests\TestCase;
use OpenDialogAi\Webchat\WebchatSetting;

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

        $setting9 = new WebchatSetting();
        $setting9->name = 'testObject';
        $setting9->value = '{"foo":"bar","bee":"baz"}';
        $setting9->type = 'object';
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
                'testObject' => [
                    'foo' => 'bar',
                    'bee' => 'baz',
                ],
            ], TRUE);
    }

    public function testSettingsApiWithUserId()
    {
        $setting = new WebchatSetting();
        $setting->name = 'newUserStartMinimized';
        $setting->value = TRUE;
        $setting->type = 'boolean';
        $setting->save();

        $setting2 = new WebchatSetting();
        $setting2->name = 'newUserClosedCallback';
        $setting2->value = 'new_user_closed_callback';
        $setting2->type = 'string';
        $setting2->save();

        $setting3 = new WebchatSetting();
        $setting3->name = 'newUserOpenCallback';
        $setting3->value = 'new_user_open_callback';
        $setting3->type = 'string';
        $setting3->save();

        $setting4 = new WebchatSetting();
        $setting4->name = 'returningUserStartMinimized';
        $setting4->value = FALSE;
        $setting4->type = 'boolean';
        $setting4->save();

        $setting5 = new WebchatSetting();
        $setting5->name = 'returningUserClosedCallback';
        $setting5->value = 'returning_user_closed_callback';
        $setting5->type = 'string';
        $setting5->save();

        $setting6 = new WebchatSetting();
        $setting6->name = 'returningUserOpenCallback';
        $setting6->value = 'returning_user_open_callback';
        $setting6->type = 'string';
        $setting6->save();

        $setting7 = new WebchatSetting();
        $setting7->name = 'ongoingUserStartMinimized';
        $setting7->value = FALSE;
        $setting7->type = 'boolean';
        $setting7->save();

        $setting8 = new WebchatSetting();
        $setting8->name = 'ongoingUserClosedCallback';
        $setting8->value = 'ongoing_user_closed_callback';
        $setting8->type = 'string';
        $setting8->save();

        $setting9 = new WebchatSetting();
        $setting9->name = 'ongoingUserOpenCallback';
        $setting9->value = 'ongoing_user_open_callback';
        $setting9->type = 'string';
        $setting9->save();

        $userId = 'test';


        $this->instance(UserService::class, Mockery::mock(UserService::class, function ($mock) {
            $mock->shouldReceive('getUserType')->andReturn('new');
        }));

        $response = $this->json('GET', '/webchat-config?user_id=' . $userId);
        $response
            ->assertStatus(200)
            ->assertJson([
                'userType' => 'new',
                'showMinimized' => true,
                'closedIntent' => 'new_user_closed_callback',
                'openIntent' => 'new_user_open_callback',
            ], TRUE);


        $this->instance(UserService::class, Mockery::mock(UserService::class, function ($mock) {
            $mock->shouldReceive('getUserType')->andReturn('ongoing');
        }));

        $response = $this->json('GET', '/webchat-config?user_id=' . $userId);
        $response
            ->assertStatus(200)
            ->assertJson([
                'userType' => 'ongoing',
                'showMinimized' => false,
                'closedIntent' => 'ongoing_user_closed_callback',
                'openIntent' => 'ongoing_user_open_callback',
            ], TRUE);


        $this->instance(UserService::class, Mockery::mock(UserService::class, function ($mock) {
            $mock->shouldReceive('getUserType')->andReturn('returning');
        }));

        $response = $this->json('GET', '/webchat-config?user_id=' . $userId);
        $response
            ->assertStatus(200)
            ->assertJson([
                'userType' => 'returning',
                'showMinimized' => false,
                'closedIntent' => 'returning_user_closed_callback',
                'openIntent' => 'returning_user_open_callback',
            ], TRUE);
    }
}
