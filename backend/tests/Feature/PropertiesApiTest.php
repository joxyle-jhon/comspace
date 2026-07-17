<?php

use App\Models\Property;
use App\Models\User;

describe('Properties API (frontend contract)', function () {

    it('lists published properties for the browse page', function () {
        $host = User::factory()->create(['role' => 'host']);
        Property::factory()->count(3)->create([
            'user_id' => $host->id,
            'is_published' => true,
            'is_active' => true,
        ]);
        Property::factory()->create([
            'user_id' => $host->id,
            'is_published' => false,
            'is_active' => true,
        ]);

        $response = $this->getJson('/api/properties');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'title', 'type', 'location', 'pricing'],
                ],
            ]);

        expect(count($response->json('data')))->toBe(3);
    });

    it('returns price preview for booking widget', function () {
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

        $response = $this->getJson("/api/properties/{$property->id}/price-preview?".http_build_query([
            'check_in' => '2026-12-01',
            'check_out' => '2026-12-04',
        ]));

        $response->assertOk()
            ->assertJsonPath('nights', 3)
            ->assertJsonPath('price_per_night', 10000)
            ->assertJsonPath('subtotal', 30000)
            ->assertJsonPath('cleaning_fee', 2000)
            ->assertJsonPath('service_fee', 3000)
            ->assertJsonPath('total_amount', 35000);
    });

    it('filters properties by type for category strip', function () {
        $host = User::factory()->create(['role' => 'host']);
        Property::factory()->create([
            'user_id' => $host->id,
            'type' => 'villa',
            'is_published' => true,
        ]);
        Property::factory()->create([
            'user_id' => $host->id,
            'type' => 'cabin',
            'is_published' => true,
        ]);

        $response = $this->getJson('/api/properties?type=villa');

        $response->assertOk();
        expect($response->json('data'))->toHaveCount(1)
            ->and($response->json('data.0.type'))->toBe('villa');
    });
});
