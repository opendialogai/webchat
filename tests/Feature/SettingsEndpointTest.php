<?php

namespace OpenDialogAi\Webchat\Tests\Feature;

use Mockery;
use OpenDialogAi\AttributeEngine\CoreAttributes\UserAttribute;
use OpenDialogAi\AttributeEngine\CoreAttributes\UserHistoryRecord;
use OpenDialogAi\AttributeEngine\Exceptions\AttributeDoesNotExistException;
use OpenDialogAi\ContextEngine\Contexts\User\UserContext;
use OpenDialogAi\ContextEngine\Facades\ContextService;
use OpenDialogAi\Webchat\Tests\TestCase;
use OpenDialogAi\Webchat\WebchatSetting;

class SettingsEndpointTest extends TestCase
{
    public function testSettingsApi()
    {
        $generalSetting = new WebchatSetting();
        $generalSetting->name = 'general';
        $generalSetting->value = 'general';
        $generalSetting->type = 'object';
        $generalSetting->save();

        $setting = new WebchatSetting();
        $setting->name = 'teamName';
        $setting->value = 'OpenDialog Webchat';
        $setting->type = 'string';
        $setting->save();

        $setting2 = new WebchatSetting();
        $setting2->name = 'open';
        $setting2->value = true;
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
        $setting8->value = false;
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
            ], true);
    }

    public function testSettingsApiWithUserIdOngoingUser()
    {
        $generalSetting = new WebchatSetting();
        $generalSetting->name = 'general';
        $generalSetting->value = 'general';
        $generalSetting->type = 'object';
        $generalSetting->save();

        $setting = new WebchatSetting();
        $setting->name = 'ongoingUserStartMinimized';
        $setting->value = false;
        $setting->type = 'boolean';
        $setting->parent()->associate($generalSetting);
        $setting->save();

        $setting = new WebchatSetting();
        $setting->name = 'ongoingUserOpenCallback';
        $setting->value = 'ongoing_user_open_callback';
        $setting->type = 'string';
        $setting->parent()->associate($generalSetting);
        $setting->save();

        $userId = 'test';

        $this->mockUserContext($userId, 1);

        $this->json('GET', '/webchat-config?user_id=' . $userId)
            ->assertStatus(200)
            ->assertJson([
                'userType' => 'ongoing',
                'showMinimized' => false,
                'openIntent' => 'ongoing_user_open_callback',
            ], true);
    }

    public function testSettingsApiWithUserIdReturningUser()
    {
        $generalSetting = new WebchatSetting();
        $generalSetting->name = 'general';
        $generalSetting->value = 'general';
        $generalSetting->type = 'object';
        $generalSetting->save();

        $setting = new WebchatSetting();
        $setting->name = 'returningUserStartMinimized';
        $setting->value = false;
        $setting->type = 'boolean';
        $setting->parent()->associate($generalSetting);
        $setting->save();

        $setting = new WebchatSetting();
        $setting->name = 'returningUserOpenCallback';
        $setting->value = 'returning_user_open_callback';
        $setting->type = 'string';
        $setting->parent()->associate($generalSetting);
        $setting->save();

        $userId = 'test';

        $this->mockUserContext($userId, 'undefined');

        $this->json('GET', '/webchat-config?user_id=' . $userId)
            ->assertStatus(200)
            ->assertJson([
                'userType' => 'returning',
                'showMinimized' => false,
                'openIntent' => 'returning_user_open_callback',
            ], true);
    }

    public function testSettingsApiWithUserIdNewUser()
    {
        $generalSetting = new WebchatSetting();
        $generalSetting->name = 'general';
        $generalSetting->value = 'general';
        $generalSetting->type = 'object';
        $generalSetting->save();

        $setting = new WebchatSetting();
        $setting->name = 'newUserStartMinimized';
        $setting->value = true;
        $setting->type = 'boolean';
        $setting->parent()->associate($generalSetting);
        $setting->save();

        $setting3 = new WebchatSetting();
        $setting3->name = 'newUserOpenCallback';
        $setting3->value = 'new_user_open_callback';
        $setting3->type = 'string';
        $setting3->parent()->associate($generalSetting);
        $setting3->save();

        $userId = 'test';

        $this->mockUserContext($userId, null, false);

        $this->json('GET', '/webchat-config?user_id=' . $userId)
            ->assertStatus(200)
            ->assertJson([
                'userType' => 'new',
                'showMinimized' => true,
                'openIntent' => 'new_user_open_callback',
            ], true);
    }

    /**
     * @param string $userId
     * @param $conversationId
     */
    private function mockUserContext(string $userId, $conversationId, $userRecordExists = true): void
    {
        $userHistoryRecord = Mockery::mock(UserHistoryRecord::class)->makePartial();
        $userHistoryRecord->shouldReceive('getConversationId')
            ->andReturn($conversationId);

        $userHistoryRecord->shouldReceive('getId')
            ->andReturn('history_record');

        $userAttribute = new UserAttribute($userId);
        $userAttribute->setUserHistoryRecord($userHistoryRecord);

        $userContext = Mockery::mock(UserContext::class)->makePartial();
        if ($userRecordExists) {
            $userContext->shouldReceive('getAttribute')
                ->withArgs(['utterance_user', true])
                ->andReturn($userAttribute);
        } else {
            $userContext->shouldReceive('getAttribute')
                ->withArgs(['utterance_user', true])
                ->andThrow(AttributeDoesNotExistException::class);
        }

        $userContext->shouldReceive('setUserId')
            ->andReturn(true);

        ContextService::shouldReceive('getContext')
            ->withArgs(['user'])
            ->andReturn($userContext);
    }
}
