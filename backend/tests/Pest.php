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

/**
 * Build a forever-valid stay window relative to now.
 *
 * @return array{check_in: string, check_out: string, nights: int}
 */
function stayWindow(int $nights = 4, int $startOffsetDays = 60): array
{
    $checkIn = now()->addDays($startOffsetDays)->startOfDay();
    $checkOut = $checkIn->copy()->addDays($nights);

    return [
        'check_in' => $checkIn->toDateString(),
        'check_out' => $checkOut->toDateString(),
        'nights' => $nights,
    ];
}
