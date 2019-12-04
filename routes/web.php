<?php

use Illuminate\Support\Facades\Route;

Route::group(['middleware' => 'web'], function() {
    Route::get('/web-chat', function () {
        return view('webchat::webchat', ['settings' => config('webchat')]);
    });
    Route::get('/web-chat-iframe', function () {
        return view('webchat::webchat-iframe', ['settings' => config('webchat')]);
    });

    Route::get('/webchat-config', 'OpenDialogAi\Webchat\Http\Controllers\WebchatSettings');
});
