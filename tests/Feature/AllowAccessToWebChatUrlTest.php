<?php

namespace OpenDialogAi\Webchat\Tests\Feature;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
use OpenDialogAi\Core\Tests\TestCase;
use OpenDialogAi\Webchat\Http\Middleware\WebChatMiddleware;
use \OpenDialogAi\Webchat\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AllowAccessToWebChatUrlTest extends TestCase
{
    use RefreshDatabase;

    public function testSettingsWebChatPermissionUserLoggedIn() {
        $user = new User();
        $user->name = 'jamie';
        $user->email = 'jamie@example.com';
        $user->password  = bcrypt('secret');
        $user->save();

         Auth::shouldReceive('check')->once()->andReturn(true);
         Auth::shouldReceive('user')->once()->andReturn($user);

         $this->actingAs($user);

         $request = Request::create('/web-chat', 'GET');

         $middleware = new WebChatMiddleware();

         $response = $middleware->handle($request, function () {});

         $this->assertEquals($response->getStatusCode(), null);
     }

     public function testSettingsWebChatPermissionUserNotLoggedIn() {
         $user = new User();
         $user->name = 'billy';
         $user->email = 'billy@example.com';
         $user->password  = bcrypt('secret');
         $user->save();

         Auth::shouldReceive('check')->once()->andReturn(false);
         Auth::shouldReceive('user')->once()->andReturn($user);

         $this->actingAs($user);

         $request = Request::create('/web-chat', 'GET');

         $middleware = new WebChatMiddleware();

         $response = $middleware->handle($request, function () {});

         $this->assertEquals($response->getStatusCode(), 302);
     }
}
