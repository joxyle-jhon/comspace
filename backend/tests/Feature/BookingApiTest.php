<?php

use App\Models\Booking;
use App\Models\Property;
use App\Models\User;

describe('Booking API', function () {

    it('allows an authenticated guest to create a booking', function () {
        $host = User::factory()->create(['role' => 'host']);
        $guest = User::factory()->create(['role' => 'guest']);
        $property = Property::factory()->create([
            'user_id' => $host->id,
            'price_per_night' => 10000,
            'cleaning_fee' => 2000,
            'service_fee_percent' => 10,
            'min_nights' => 1,
            'max_nights' => 30,
            'max_guests' => 4,
            'instant_book' => true,
        ]);

        $stay = stayWindow(nights: 3);

        $response = $this->actingAs($guest)->postJson(
            "/api/properties/{$property->id}/bookings",
            [
                'check_in' => $stay['check_in'],
                'check_out' => $stay['check_out'],
                'guest_count' => 2,
                'guest_note' => 'Early check-in please.',
            ]
        );

        $response->assertStatus(201)
            ->assertJsonPath('status', 'confirmed')
            ->assertJsonPath('pricing.nights', 3)
            ->assertJsonPath('pricing.subtotal', 30000)
            ->assertJsonPath('pricing.cleaning_fee', 2000)
            ->assertJsonPath('pricing.service_fee', 3000)
            ->assertJsonPath('pricing.total_amount', 35000);
    });

    it('sets status to pending for non-instant-book properties', function () {
        $host = User::factory()->create(['role' => 'host']);
        $guest = User::factory()->create(['role' => 'guest']);
        $property = Property::factory()->create([
            'user_id' => $host->id,
            'price_per_night' => 10000,
            'min_nights' => 1,
            'max_nights' => 30,
            'max_guests' => 4,
            'instant_book' => false,
        ]);

        $stay = stayWindow(nights: 3);

        $response = $this->actingAs($guest)->postJson(
            "/api/properties/{$property->id}/bookings",
            [
                'check_in' => $stay['check_in'],
                'check_out' => $stay['check_out'],
                'guest_count' => 2,
            ]
        );

        $response->assertStatus(201)
            ->assertJsonPath('status', 'pending');
    });

    it('prevents a host from booking their own property', function () {
        $host = User::factory()->create(['role' => 'host']);
        $property = Property::factory()->create([
            'user_id' => $host->id,
            'price_per_night' => 10000,
            'min_nights' => 1,
            'max_nights' => 30,
            'max_guests' => 4,
            'instant_book' => true,
        ]);

        $stay = stayWindow(nights: 3);

        $response = $this->actingAs($host)->postJson(
            "/api/properties/{$property->id}/bookings",
            [
                'check_in' => $stay['check_in'],
                'check_out' => $stay['check_out'],
                'guest_count' => 2,
            ]
        );

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['property']);
    });

    it('allows a host to confirm a pending booking', function () {
        $host = User::factory()->create(['role' => 'host']);
        $guest = User::factory()->create(['role' => 'guest']);
        $property = Property::factory()->create([
            'user_id' => $host->id,
            'price_per_night' => 10000,
            'cleaning_fee' => 2000,
            'min_nights' => 1,
            'max_nights' => 30,
            'max_guests' => 4,
            'instant_book' => false,
        ]);

        $stay = stayWindow(nights: 3);

        $createResponse = $this->actingAs($guest)->postJson(
            "/api/properties/{$property->id}/bookings",
            [
                'check_in' => $stay['check_in'],
                'check_out' => $stay['check_out'],
                'guest_count' => 2,
            ]
        );

        $createResponse->assertStatus(201);
        $bookingId = $createResponse->json('id');

        $confirmResponse = $this->actingAs($host)->patchJson(
            "/api/bookings/{$bookingId}/confirm"
        );

        $confirmResponse->assertOk()
            ->assertJsonPath('booking.status', 'confirmed');
    });

    it('allows a guest to cancel their booking', function () {
        $host = User::factory()->create(['role' => 'host']);
        $guest = User::factory()->create(['role' => 'guest']);
        $property = Property::factory()->create([
            'user_id' => $host->id,
            'price_per_night' => 10000,
            'cleaning_fee' => 2000,
            'min_nights' => 1,
            'max_nights' => 30,
            'max_guests' => 4,
            'instant_book' => true,
        ]);

        $stay = stayWindow(nights: 3);

        $createResponse = $this->actingAs($guest)->postJson(
            "/api/properties/{$property->id}/bookings",
            [
                'check_in' => $stay['check_in'],
                'check_out' => $stay['check_out'],
                'guest_count' => 2,
            ]
        );

        $createResponse->assertStatus(201);
        $bookingId = $createResponse->json('id');

        $cancelResponse = $this->actingAs($guest)->patchJson(
            "/api/bookings/{$bookingId}/cancel",
            ['reason' => 'Plans changed.']
        );

        $cancelResponse->assertOk()
            ->assertJsonPath('booking.status', 'cancelled');
    });

    it('returns 401 for unauthenticated users on protected booking endpoints', function () {
        $this->postJson('/api/properties/1/bookings', [
            'check_in' => now()->addDays(60)->toDateString(),
            'check_out' => now()->addDays(63)->toDateString(),
            'guest_count' => 2,
        ])->assertUnauthorized();

        $this->getJson('/api/bookings')->assertUnauthorized();

        $this->patchJson('/api/bookings/1/cancel')->assertUnauthorized();

        $this->patchJson('/api/bookings/1/confirm')->assertUnauthorized();
    });
});
