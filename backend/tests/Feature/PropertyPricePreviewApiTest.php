<?php

use App\Models\Property;
use App\Models\User;

describe('Property price preview API', function () {

    it('returns price breakdown in cents for a valid stay', function () {
        $host = User::factory()->create(['role' => 'host']);
        $property = Property::factory()->create([
            'user_id' => $host->id,
            'price_per_night' => 10000,
            'cleaning_fee' => 2000,
            'service_fee_percent' => 10,
            'min_nights' => 1,
            'max_nights' => 30,
            'is_published' => true,
        ]);

        $stay = stayWindow(nights: 3);

        $this->getJson("/api/properties/{$property->id}/price-preview?".http_build_query([
            'check_in' => $stay['check_in'],
            'check_out' => $stay['check_out'],
        ]))
            ->assertOk()
            ->assertJsonPath('nights', 3)
            ->assertJsonPath('price_per_night', 10000)
            ->assertJsonPath('subtotal', 30000)
            ->assertJsonPath('cleaning_fee', 2000)
            ->assertJsonPath('service_fee', 3000)
            ->assertJsonPath('total_amount', 35000);
    });

    it('rejects check-in dates in the past', function () {
        $host = User::factory()->create(['role' => 'host']);
        $property = Property::factory()->create([
            'user_id' => $host->id,
            'is_published' => true,
        ]);

        $this->getJson("/api/properties/{$property->id}/price-preview?".http_build_query([
            'check_in' => now()->subDay()->toDateString(),
            'check_out' => now()->addDays(3)->toDateString(),
        ]))
            ->assertUnprocessable()
            ->assertJsonPath('error.code', 'VALIDATION_ERROR')
            ->assertJsonValidationErrors(['check_in']);
    });

    it('rejects check-out on or before check-in', function () {
        $host = User::factory()->create(['role' => 'host']);
        $property = Property::factory()->create([
            'user_id' => $host->id,
            'is_published' => true,
        ]);

        $checkIn = now()->addDays(10)->toDateString();

        $this->getJson("/api/properties/{$property->id}/price-preview?".http_build_query([
            'check_in' => $checkIn,
            'check_out' => $checkIn,
        ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['check_out']);
    });

    it('requires check-in and check-out query params', function () {
        $host = User::factory()->create(['role' => 'host']);
        $property = Property::factory()->create([
            'user_id' => $host->id,
            'is_published' => true,
        ]);

        $this->getJson("/api/properties/{$property->id}/price-preview")
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['check_in', 'check_out']);
    });

    it('enforces minimum stay rules', function () {
        $host = User::factory()->create(['role' => 'host']);
        $property = Property::factory()->create([
            'user_id' => $host->id,
            'min_nights' => 3,
            'is_published' => true,
        ]);

        $stay = stayWindow(nights: 2);

        $this->getJson("/api/properties/{$property->id}/price-preview?".http_build_query([
            'check_in' => $stay['check_in'],
            'check_out' => $stay['check_out'],
        ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['check_in']);
    });
});
