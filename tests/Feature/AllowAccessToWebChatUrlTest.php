<?php

namespace OpenDialogAi\Webchat\Tests\Feature;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
use OpenDialogAi\Core\Tests\TestCase;
use OpenDialogAi\Webchat\Http\Middleware\WebChatMiddleware;
use \OpenDialogAi\Webchat\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use OpenDialogAi\Webchat\WebchatSetting;

class AllowAccessToWebChatUrlTest extends TestCase
{
    use RefreshDatabase;

    public function testSettingsWebChatPermissionUserLoggedIn() {
        $this->webChatSetting(FALSE);
        $this->userCreate();
        $this->runMiddleWare(null);
     }

     public function testSettingsWebChatPermissionUserNotLoggedIn() {
         $this->webChatSetting(FALSE);
         $this->userCreate();
         $this->runMiddleWare(302);
     }

    public function testSettingsWebChatPermissionUserIsTrueAndNotLoggedIn() {
        $this->webChatSetting(TRUE);
        $this->userCreate();
        $this->runMiddleWare(null);
    }

    public function testSettingsWebChatPermissionUserIsTrueAndLoggenIn() {
        $this->webChatSetting(TRUE);
        $this->userCreate();
        $this->runMiddleWare(null);

    }

    public function webChatSetting($val){
        $setting = new WebchatSetting();
        $setting->name = $setting::WEBCHAT_FULL_PAGE_PUBLIC;
        $setting->value = $val;
        $setting->type = 'boolean';
        $setting->save();
    }

    public function userCreate(){
        $user = new User();
        $user->name = 'billy';
        $user->email = 'billy@example.com';
        $user->password  = bcrypt('secret');
        $user->save();

        Auth::shouldReceive('check')->once()->andReturn(true);
        Auth::shouldReceive('user')->once()->andReturn($user);

        $this->actingAs($user);
    }

    public function runMiddleWare($result){
        $request = Request::create('/web-chat', 'GET');

        $middleware = new WebChatMiddleware();

        $response = $middleware->handle($request, function () {});

        $this->assertEquals($response->getStatusCode(), $result);
    }
}
