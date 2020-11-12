<?php

namespace OpenDialogAi\Webchat\Tests\Feature;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
use OpenDialogAi\Webchat\Tests\TestCase;
use OpenDialogAi\Webchat\Http\Middleware\WebChatMiddleware;
use OpenDialogAi\Webchat\Tests\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use OpenDialogAi\Webchat\WebchatSetting;

class AllowAccessToWebChatUrlTest extends TestCase
{
    use RefreshDatabase;

    public function testSettingsWebChatPermissionUserLoggedIn() {
        $this->webChatSetting(FALSE);
        $this->userCreateAuth();
        $this->runMiddleWareNull(null);
     }

     public function testSettingsWebChatPermissionUserNotLoggedIn() {
         $this->webChatSetting(FALSE);
         $this->userCreateNotAuth();
         $this->runMiddleWareNotNull(302);
     }

    public function testSettingsWebChatPermissionUserIsTrueAndNotLoggedIn() {
        $this->webChatSetting(TRUE);
        $this->userCreateNotAuth();
        $this->runMiddleWareNull(null);
    }

    public function testSettingsWebChatPermissionUserIsTrueAndLoggenIn() {
        $this->webChatSetting(TRUE);
        $this->userCreateAuth();
        $this->runMiddleWareNull(null);

    }

    public function webChatSetting($val){
        $setting = new WebchatSetting();
        $setting->name = $setting::WEBCHAT_FULL_PAGE_PUBLIC;
        $setting->value = $val;
        $setting->type = 'boolean';
        $setting->save();
    }

    public function userCreateAuth(){
        $user = new User();
        $user->name = 'billy';
        $user->email = 'billy@example.com';
        $user->password  = bcrypt('secret');

        $this->actingAs($user);
    }

    public function userCreateNotAuth(){
        $user = new User();
        $user->name = 'billy';
        $user->email = 'billy@example.com';
        $user->password  = bcrypt('secret');
    }

    public function runMiddleWareNull($result){

        $request = Request::create('/web-chat', 'GET');

        $middleware = new WebChatMiddleware();

        $response = $middleware->handle($request, function () {});

        $this->assertEquals($response, $result);
    }

    public function runMiddleWareNotNull($result){

        $request = Request::create('/web-chat', 'GET');

        $middleware = new WebChatMiddleware();

        $response = $middleware->handle($request, function () {});

        $this->assertEquals($response->getStatusCode(), $result);
    }
}
