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
