<?php

namespace OpenDialogAi\Webchat\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use OpenDialogAi\Webchat\WebchatSetting;

class Install extends Command
{
    protected $signature = 'webchat:install';

    protected $description = 'Installs the webchat package by publishing it\'s assets';

    public function handle()
    {
        $this->callSilent('vendor:publish', ['--tag' => 'public']);
        $this->callSilent('webchat:setup');

        $this->info('OpenDialog webchat package has been installed');
    }
}
