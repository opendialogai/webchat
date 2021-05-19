<?php

return [
    'multi_tenant' => env('MULTI_TENANT', false),

    'migration_publish_dir' => env('MULTI_TENANT', false) ? 'migrations/tenant' : 'migrations'
];
