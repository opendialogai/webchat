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

    /** @var string[] */
    private $persistedSettings = [];

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        foreach (config('opendialog.webchat_setting') as $parent => $webchatSettings) {
            foreach ($webchatSettings as $settingName => $details) {
                if (is_array($details)) {
                    $parentId = $this->getParentId($parent);
                    $sibling =
                        isset($details[WebchatSetting::SIBLING]) ?
                            $this->getSiblingId($details[WebchatSetting::SIBLING]) :
                            null;

                    $setting = WebchatSetting::updateOrCreate(
                        [
                            'name' => $settingName,
                        ],
                        [
                            'display_name' => $details[WebchatSetting::DISPLAY_NAME] ?? $settingName,
                            'description' => $details[WebchatSetting::DESCRIPTION] ?? null,
                            'display' => $details[WebchatSetting::DISPLAY] ?? true,
                            'section' => $details[WebchatSetting::SECTION] ?? null,
                            'subsection' => $details[WebchatSetting::SUBSECTION] ?? null,
                            'type' => $details[WebchatSetting::TYPE] ?? WebchatSetting::STRING,
                            'parent_id' => $parentId,
                            'sibling' => $sibling
                        ]
                    );

                    if ($setting->wasRecentlyCreated) {
                        $this->log("Created new webchat setting '$settingName'");
                    } else if ($setting->wasChanged()) {
                        $this->log("Webchat Setting '$settingName' was updated");
                    }

                    $this->persistedSettings[] = $settingName;
                } else {
                    $this->log(
                        sprintf('Setting %s not persisted as the config is in the wrong format', $settingName),
                        'warn'
                    );
                }
            }
        }

        foreach (DB::table('webchat_settings')->get() as $item) {
            if (!in_array($item->name, $this->persistedSettings)) {
                DB::table('webchat_settings')
                    ->where('id', $item->id)
                    ->delete();
                $this->log("Removed webchat setting '$item->name' of type '$item->type'");
            }
        }

        return 0;
    }

    /**
     * Logs to the log file and the console output
     *
     * @param $message
     * @param string $level
     */
    private function log($message, $level = 'info')
    {
        switch ($level) {
            case 'error':
                Log::error($message);
                $this->error($message);
                break;
            case 'warn':
                Log::warning($message);
                $this->warn($message);
                break;
            default:
                Log::info($message);
                $this->info($message);
                break;
        }
    }

    /**
     * Gets the top level parent ID, or creates and saves one if it doesn't exist
     *
     * @param $name
     * @return int
     */
    private function getParentId($name): int
    {
        /** @var WebchatSetting $setting */
        $setting = WebchatSetting::updateOrCreate(
            [
                'name' => $name
            ],
            [
                'type' => WebchatSetting::OBJECT,
                'name' => $name,
                'value' => null,
                'display' => false,
            ]
        );

        if ($setting->wasRecentlyCreated) {
            $this->log(sprintf("Created new parent setting %s", $setting->name));
        }

        $parentId = $setting->id;

        if (!(in_array($name, $this->persistedSettings))) {
            $this->persistedSettings[] = $name;
        }

        return $parentId;
    }

    /**
     * Creates a sibling with just a name to get it's ID
     * @param $siblingName
     */
    private function getSiblingId($siblingName): int
    {
        /** @var WebchatSetting $sibling */
        $sibling = WebchatSetting::updateOrCreate(
            [
                'name' => $siblingName
            ]
        );

        return $sibling->id;
    }
}
