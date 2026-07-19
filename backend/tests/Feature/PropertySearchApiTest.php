<?php

use App\Models\Amenity;
use App\Models\AvailabilityBlock;
use App\Models\Booking;
use App\Models\Property;
use App\Models\User;

describe('Property search API', function () {

    it('filters properties by location, guests, type, price, and instant booking', function () {
        $host = User::factory()->create(['role' => 'host']);
        $matching = Property::factory()->create([
            'user_id' => $host->id,
            'city' => 'Singapore',
            'country' => 'Singapore',
            'type' => 'villa',
            'max_guests' => 4,
            'price_per_night' => 12000,
            'instant_book' => true,
        ]);

        Property::factory()->create([
            'user_id' => $host->id,
            'city' => 'Singapore',
            'type' => 'villa',
            'max_guests' => 2,
            'price_per_night' => 12000,
            'instant_book' => true,
        ]);

        Property::factory()->create([
            'user_id' => $host->id,
            'city' => 'Singapore',
            'type' => 'apartment',
            'max_guests' => 4,
            'price_per_night' => 12000,
            'instant_book' => true,
        ]);

        $response = $this->getJson('/api/properties?'.http_build_query([
            'location' => 'singapore',
            'guests' => 3,
            'type' => 'villa',
            'min_price' => 10000,
            'max_price' => 15000,
            'instant_book' => true,
        ]));

        $response->assertOk();

        expect($response->json('data'))->toHaveCount(1)
            ->and($response->json('data.0.id'))->toBe($matching->id);
    });

    it('excludes bookings and host blocks that overlap requested dates', function () {
        $host = User::factory()->create(['role' => 'host']);
        $guest = User::factory()->create(['role' => 'guest']);
        $booked = Property::factory()->create(['user_id' => $host->id]);
        $blocked = Property::factory()->create(['user_id' => $host->id]);
        $available = Property::factory()->create(['user_id' => $host->id]);
        $stay = stayWindow(nights: 4);

        Booking::factory()->create([
            'property_id' => $booked->id,
            'guest_id' => $guest->id,
            'check_in' => $stay['check_in'],
            'check_out' => $stay['check_out'],
            'status' => 'confirmed',
        ]);

        AvailabilityBlock::create([
            'property_id' => $blocked->id,
            'blocked_from' => $stay['check_in'],
            'blocked_to' => $stay['check_out'],
            'reason' => 'Maintenance',
        ]);

        $response = $this->getJson('/api/properties?'.http_build_query([
            'check_in' => $stay['check_in'],
            'check_out' => $stay['check_out'],
        ]));

        $response->assertOk();

        expect(collect($response->json('data'))->pluck('id')->all())
            ->toBe([$available->id]);
    });

    it('requires properties to contain every requested amenity', function () {
        $host = User::factory()->create(['role' => 'host']);
        $wifi = Amenity::create(['name' => 'Wi-Fi', 'category' => 'general']);
        $kitchen = Amenity::create(['name' => 'Kitchen', 'category' => 'kitchen']);
        $matching = Property::factory()->create(['user_id' => $host->id]);
        $partial = Property::factory()->create(['user_id' => $host->id]);

        $matching->amenities()->attach([$wifi->id, $kitchen->id]);
        $partial->amenities()->attach($wifi->id);

        $response = $this->getJson('/api/properties?'.http_build_query([
            'amenities' => [$wifi->id, $kitchen->id],
        ]));

        $response->assertOk();

        expect($response->json('data'))->toHaveCount(1)
            ->and($response->json('data.0.id'))->toBe($matching->id);
    });

    it('sorts results and paginates twelve properties per page', function () {
        $host = User::factory()->create(['role' => 'host']);

        foreach (range(1, 13) as $index) {
            Property::factory()->create([
                'user_id' => $host->id,
                'price_per_night' => $index * 1000,
            ]);
        }

        $firstPage = $this->getJson('/api/properties?sort=price_per_night&dir=asc');

        $firstPage->assertOk()
            ->assertJsonCount(12, 'data')
            ->assertJsonPath('data.0.pricing.price_per_night', 1000)
            ->assertJsonPath('meta.per_page', 12)
            ->assertJsonPath('meta.last_page', 2);

        $this->getJson('/api/properties?sort=price_per_night&dir=asc&page=2')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.pricing.price_per_night', 13000);
    });

    it('returns structured validation errors for invalid filters', function () {
        $response = $this->getJson('/api/properties?'.http_build_query([
            'check_in' => now()->subDay()->toDateString(),
            'type' => 'castle',
            'sort' => 'title',
            'min_price' => 10000,
            'max_price' => 5000,
        ]));

        $response->assertUnprocessable()
            ->assertJsonPath('success', false)
            ->assertJsonPath('error.code', 'VALIDATION_ERROR')
            ->assertJsonValidationErrors(['check_in', 'type', 'sort', 'max_price']);
    });
});
