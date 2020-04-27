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

    Route::post('/user/{user_id}/history', 'OpenDialogAi\Webchat\Http\Controllers\HistoryController');

    Route::get('/download/{user_id}/webchat', 'OpenDialogAi\Webchat\Http\Controllers\HistoryController@export');
});
