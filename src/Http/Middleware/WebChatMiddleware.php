<?php

namespace OpenDialogAi\Webchat\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use OpenDialogAi\Webchat\WebchatSetting;

class WebChatMiddleware
{
    /**
     * Run the request filter.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if (WebchatSetting::getWebChatPermission() == '0' && !Auth::check()) {
            Log::info('you have no permission to access this page');
            return redirect('/');
        }

        return $next($request);
    }
}
