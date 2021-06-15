<?php

/**
 * Config for the webchat component
 */
return [
    'allow-fullpage' => env('ALLOW_FULLPAGE_WEBCHAT', false),

    'multi_tenant' => env('MULTI_TENANT', false),

    'migration_publish_dir' => env('MULTI_TENANT', false) ? 'migrations/tenant' : 'migrations'
];