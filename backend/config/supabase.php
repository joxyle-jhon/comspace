<?php

return [

    'url' => rtrim(env('SUPABASE_URL', ''), '/'),

    'anon_key' => env('SUPABASE_ANON_KEY'),

    'service_key' => env('SUPABASE_SERVICE_KEY'),

    'storage_bucket' => env('SUPABASE_STORAGE_BUCKET', 'comspace-images'),

];
