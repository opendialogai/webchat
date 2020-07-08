<?php

namespace OpenDialogAi\Webchat\Tests;

use OpenDialogAi\Webchat\PackageServiceProvider;
use OpenDialogAi\Webchat\WebchatSettingsConfiguration\WebchatSettingsConfigurationServiceProvider;

/**
 * Base TestCase class for setting up all package tests
 */
class TestCase extends \Orchestra\Testbench\TestCase
{
    protected function setUp() :void
    {
        parent::setUp();

        $this->artisan('migrate', [
            '--database' => 'testbench'
        ]);
    }

    public function getPackageProviders($app)
    {
        return [
            PackageServiceProvider::class,
            WebchatSettingsConfigurationServiceProvider::class,
        ];
    }

    protected function getEnvironmentSetUp($app)
    {
        # Setup default database to use sqlite :memory:
        $app['config']->set('database.default', 'testbench');
        $app['config']->set('database.connections.testbench', [
            'driver'   => 'sqlite',
            'database' => ':memory:',
            'prefix'   => '',
        ]);
    }
}
