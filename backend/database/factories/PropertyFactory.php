<?php

namespace Database\Factories;

use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PropertyFactory extends Factory
{
    protected $model = Property::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => $this->faker->sentence(),
            'description' => $this->faker->paragraph(5),
            'type' => $this->faker->randomElement(['apartment', 'house', 'villa', 'cabin', 'studio', 'loft', 'condo']),
            'address' => $this->faker->streetAddress(),
            'city' => $this->faker->city(),
            'state' => $this->faker->state(),
            'country' => $this->faker->country(),
            'postal_code' => $this->faker->postcode(),
            'latitude' => $this->faker->latitude(),
            'longitude' => $this->faker->longitude(),
            'max_guests' => $this->faker->numberBetween(1, 10),
            'bedrooms' => $this->faker->numberBetween(1, 5),
            'beds' => $this->faker->numberBetween(1, 8),
            'bathrooms' => $this->faker->numberBetween(1, 4),
            'price_per_night' => $this->faker->numberBetween(3000, 50000), // in cents ($30 - $500)
            'cleaning_fee' => $this->faker->numberBetween(1000, 10000), // in cents ($10 - $100)
            'service_fee_percent' => 14,
            'min_nights' => 1,
            'max_nights' => 30,
            'instant_book' => $this->faker->boolean(),
            'is_published' => true,
            'is_active' => true,
        ];
    }
}
