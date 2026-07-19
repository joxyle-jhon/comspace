<?php

use App\Models\Booking;
use App\Models\Property;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

describe('Host API statistics', function () {

    it('returns host dashboard statistics for authenticated hosts', function () {
        $host = User::factory()->create(['role' => 'host']);
        Sanctum::actingAs($host);

        $property = Property::factory()->create([
            'user_id' => $host->id,
            'is_published' => true,
        ]);

        Booking::factory()->create([
            'property_id' => $property->id,
            'status' => 'confirmed',
            'check_in' => now()->addDays(2)->toDateString(),
            'check_out' => now()->addDays(5)->toDateString(),
        ]);

        $response = $this->getJson('/api/host/stats');

        $response->assertOk()
            ->assertJsonStructure([
                'total_properties',
                'total_bookings',
                'total_revenue',
                'pending_bookings',
                'avg_rating',
                'recent_bookings',
                'upcoming_arrivals',
            ]);
    });

    it('denies access to guests', function () {
        $guest = User::factory()->create(['role' => 'guest']);
        Sanctum::actingAs($guest);

        $response = $this->getJson('/api/host/stats');

        $response->assertForbidden();
    });

    it('denies access to unauthenticated users', function () {
        $response = $this->getJson('/api/host/stats');

        $response->assertUnauthorized();
    });
});
