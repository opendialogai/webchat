<?php

namespace OpenDialogAi\Webchat\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use OpenDialogAi\Webchat\WebchatSetting;

class WebchatSettings extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'webchat:settings';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update webchat settings table';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $settings = WebchatSetting::getSettings();

        $configNames = [];
        foreach ($settings as $type => $values) {
            foreach ($values as $subType => $value) {
                if (is_array($value)) {
                    $configItem = WebchatSetting::where('name', $type)
                        ->first();

                    if ($configItem == null) {
                        $configItemId = DB::table('webchat_settings')->insertGetId([
                            'type' => WebchatSetting::OBJECT,
                            'name' => $type,
                            'value' => null,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);

                        $this->log("Created webchat setting '$type' of type '" . WebchatSetting::OBJECT . "'");
                    } else {
                        $configItemId = $configItem->id;
                    }

                    $configNames[] = $type;

                    foreach ($value as $subValue) {
                        $item = WebchatSetting::where('name', $subValue)
                            ->first();

                        if ($item == null) {
                            DB::table('webchat_settings')->insert([
                                'type' => $subType,
                                'name' => $subValue,
                                'value' => null,
                                'created_at' => now(),
                                'updated_at' => now(),
                                'parent_id' => $configItemId,
                            ]);

                            $this->log("Created webchat setting '$subValue' of type '$subType'");
                        }

                        $configNames[] = $subValue;
                    }
                } else {
                    $item = WebchatSetting::where('name', $value)
                        ->first();

                    if ($item == null) {
                        DB::table('webchat_settings')->insert([
                            'type' => $type,
                            'name' => $value,
                            'value' => null,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);

                        $this->log("Created webchat setting '$value' of type '$type'");
                    } elseif ($item->type != $type) {
                        DB::table('webchat_settings')
                            ->where('name', $value)
                            ->update([
                                'type' => $type,
                            ]);

                        $this->log("Updated webchat setting '$value' from type '$item->type' to '$type'");
                    }

                    $configNames[] = $value;
                }
            }
        }

        foreach (DB::table('webchat_settings')->get() as $item) {
            if (!in_array($item->name, $configNames)) {
                DB::table('webchat_settings')
                    ->where('id', $item->id)
                    ->delete();
                $this->log("Removed webchat setting '$item->name' of type '$item->type'");
            }
        }
    }

    /**
     * Logs to the log file and the console output
     *
     * @param $message
     */
    private function log($message)
    {
        Log::info($message);
        $this->info($message);
    }
}
