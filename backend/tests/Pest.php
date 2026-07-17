<?php

uses(
    Tests\TestCase::class,
    Illuminate\Foundation\Testing\RefreshDatabase::class,
)->in('Feature');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
|
| Feature tests use SQLite in-memory (phpunit.xml) so the frontend-facing
| API can be verified without a running Postgres instance. Booking locks
| degrade gracefully on SQLite; Postgres still uses FOR NO KEY UPDATE.
|
*/
