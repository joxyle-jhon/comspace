<?php

namespace Database\Seeders;

use App\Models\Amenity;
use App\Models\Booking;
use App\Models\Property;
use App\Models\PropertyImage;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Key Users
        $defaultPassword = Hash::make('password');

        $testUser = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => $defaultPassword,
                'role' => 'guest',
                'email_verified_at' => now(),
            ]
        );

        $hostUser = User::firstOrCreate(
            ['email' => 'host@example.com'],
            [
                'name' => 'Sarah Connor (Host)',
                'password' => $defaultPassword,
                'role' => 'host',
                'is_verified_host' => true,
                'host_since' => now()->subYears(3),
                'response_rate' => 99,
                'response_time' => 'within an hour',
                'bio' => 'Passionate traveler and host offering unique designer spaces around the world.',
                'email_verified_at' => now(),
            ]
        );

        $guestUser = User::firstOrCreate(
            ['email' => 'guest@example.com'],
            [
                'name' => 'Alex Mercer (Guest)',
                'password' => $defaultPassword,
                'role' => 'guest',
                'email_verified_at' => now(),
            ]
        );

        // Additional hosts & guests
        $otherHosts = User::factory()->count(3)->create([
            'role' => 'host',
            'is_verified_host' => true,
            'password' => $defaultPassword,
        ]);

        $otherGuests = User::factory()->count(5)->create([
            'role' => 'guest',
            'password' => $defaultPassword,
        ]);

        // 2. Seed Amenities
        $amenitiesData = [
            ['name' => 'Fast Wi-Fi', 'icon' => 'wifi', 'category' => 'general'],
            ['name' => 'Air Conditioning', 'icon' => 'wind', 'category' => 'general'],
            ['name' => 'Chef\'s Kitchen', 'icon' => 'utensils', 'category' => 'kitchen'],
            ['name' => 'Swimming Pool', 'icon' => 'waves', 'category' => 'outdoor'],
            ['name' => 'Free Parking', 'icon' => 'car', 'category' => 'general'],
            ['name' => 'Dedicated Workspace', 'icon' => 'laptop', 'category' => 'general'],
            ['name' => 'Hot Tub', 'icon' => 'bath', 'category' => 'outdoor'],
            ['name' => 'EV Charger', 'icon' => 'zap', 'category' => 'outdoor'],
            ['name' => 'Patio & BBQ', 'icon' => 'flame', 'category' => 'outdoor'],
            ['name' => 'Ocean View', 'icon' => 'sun', 'category' => 'views'],
            ['name' => 'Self Check-in', 'icon' => 'key', 'category' => 'services'],
            ['name' => 'Washer & Dryer', 'icon' => 'shirt', 'category' => 'general'],
        ];

        $amenityModels = collect($amenitiesData)->map(function ($item) {
            return Amenity::firstOrCreate(['name' => $item['name']], $item);
        });

        // 3. Seed Properties
        $propertiesData = [
            [
                'user_id' => $hostUser->id,
                'title' => 'Luxury Glass Villa with Panoramic Ocean Views',
                'description' => 'Experience ultimate tranquility in this modern glass villa overlooking the ocean. Features a private infinity pool, custom Scandinavian interiors, and floor-to-ceiling windows.',
                'type' => 'villa',
                'address' => '10880 Pacific Coast Hwy',
                'city' => 'Malibu',
                'state' => 'California',
                'country' => 'United States',
                'postal_code' => '90265',
                'latitude' => 34.0259,
                'longitude' => -118.7798,
                'max_guests' => 6,
                'bedrooms' => 3,
                'beds' => 4,
                'bathrooms' => 3,
                'price_per_night' => 45000, // $450/night
                'cleaning_fee' => 12000, // $120
                'service_fee_percent' => 14,
                'min_nights' => 2,
                'max_nights' => 14,
                'instant_book' => true,
                'is_published' => true,
                'is_active' => true,
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', 'caption' => 'Exterior sunset view', 'is_cover' => true],
                    ['url' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', 'caption' => 'Living room with floor-to-ceiling glass', 'is_cover' => false],
                    ['url' => 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', 'caption' => 'Infinity pool overlook', 'is_cover' => false],
                ],
            ],
            [
                'user_id' => $hostUser->id,
                'title' => 'Minimalist Japanese Zen Machiya Loft',
                'description' => 'A beautifully restored traditional Kyoto Machiya updated with minimalist modern aesthetics. Relax in the private bamboo garden and soak in the cypress wood bathtub.',
                'type' => 'house',
                'address' => '45 Gion-machi',
                'city' => 'Kyoto',
                'state' => 'Kyoto Prefecture',
                'country' => 'Japan',
                'postal_code' => '605-0073',
                'latitude' => 35.0037,
                'longitude' => 135.7772,
                'max_guests' => 4,
                'bedrooms' => 2,
                'beds' => 3,
                'bathrooms' => 2,
                'price_per_night' => 28000, // $280/night
                'cleaning_fee' => 8000, // $80
                'service_fee_percent' => 14,
                'min_nights' => 1,
                'max_nights' => 30,
                'instant_book' => true,
                'is_published' => true,
                'is_active' => true,
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80', 'caption' => 'Traditional Zen interior', 'is_cover' => true],
                    ['url' => 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80', 'caption' => 'Private garden courtyard', 'is_cover' => false],
                ],
            ],
            [
                'user_id' => $otherHosts[0]->id,
                'title' => 'Cozy Alpine Chalet with Private Sauna & Hot Tub',
                'description' => 'Warm wooden interiors, stone fireplace, and breathtaking mountain views. Ideal ski-in/ski-out retreat after a long day on the slopes.',
                'type' => 'cabin',
                'address' => '12 Alpine Way',
                'city' => 'Chamonix',
                'state' => 'Haute-Savoie',
                'country' => 'France',
                'postal_code' => '74400',
                'latitude' => 45.9237,
                'longitude' => 6.8694,
                'max_guests' => 8,
                'bedrooms' => 4,
                'beds' => 6,
                'bathrooms' => 3,
                'price_per_night' => 35000, // $350/night
                'cleaning_fee' => 10000, // $100
                'service_fee_percent' => 14,
                'min_nights' => 3,
                'max_nights' => 21,
                'instant_book' => false,
                'is_published' => true,
                'is_active' => true,
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80', 'caption' => 'Chalet winter exterior', 'is_cover' => true],
                    ['url' => 'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80', 'caption' => 'Cozy fireplace lounge', 'is_cover' => false],
                ],
            ],
            [
                'user_id' => $otherHosts[1]->id,
                'title' => 'Industrial Penthouse Studio with Sky Terrace',
                'description' => 'Sun-drenched loft in the heart of SoHo featuring exposed brick, high ceilings, custom artwork, and a private rooftop garden.',
                'type' => 'loft',
                'address' => '142 Spring Street',
                'city' => 'New York',
                'state' => 'New York',
                'country' => 'United States',
                'postal_code' => '10012',
                'latitude' => 40.7251,
                'longitude' => -74.0012,
                'max_guests' => 2,
                'bedrooms' => 1,
                'beds' => 1,
                'bathrooms' => 1,
                'price_per_night' => 32000, // $320/night
                'cleaning_fee' => 9000, // $90
                'service_fee_percent' => 14,
                'min_nights' => 2,
                'max_nights' => 14,
                'instant_book' => true,
                'is_published' => true,
                'is_active' => true,
                'images' => [
                    ['url' => 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80', 'caption' => 'SoHo Loft Interior', 'is_cover' => true],
                ],
            ],
        ];

        foreach ($propertiesData as $pData) {
            $images = $pData['images'];
            unset($pData['images']);

            $property = Property::create($pData);

            // Attach random 4-6 amenities
            $property->amenities()->sync($amenityModels->random(rand(4, 6))->pluck('id'));

            // Create images
            foreach ($images as $index => $imgData) {
                PropertyImage::create([
                    'property_id' => $property->id,
                    'url' => $imgData['url'],
                    'caption' => $imgData['caption'],
                    'is_cover' => $imgData['is_cover'],
                    'sort_order' => $index,
                ]);
            }

            // 4. Seed Bookings & Reviews for each property
            $completedBooking = Booking::create([
                'property_id' => $property->id,
                'guest_id' => $guestUser->id,
                'check_in' => now()->subDays(20)->toDateString(),
                'check_out' => now()->subDays(17)->toDateString(),
                'guest_count' => 2,
                'nights' => 3,
                'price_per_night' => $property->price_per_night,
                'subtotal' => $property->price_per_night * 3,
                'cleaning_fee' => $property->cleaning_fee,
                'service_fee' => (int) round(($property->price_per_night * 3) * 0.14),
                'total_amount' => ($property->price_per_night * 3) + $property->cleaning_fee + (int) round(($property->price_per_night * 3) * 0.14),
                'status' => 'completed',
                'payment_status' => 'paid',
            ]);

            // Review for completed booking
            Review::create([
                'booking_id' => $completedBooking->id,
                'property_id' => $property->id,
                'guest_id' => $guestUser->id,
                'rating' => 5,
                'cleanliness_rating' => 5,
                'accuracy_rating' => 5,
                'communication_rating' => 5,
                'location_rating' => 5,
                'value_rating' => 4,
                'comment' => 'Absolutely unforgettable stay! The host was super helpful, and the space was even better than the photos.',
                'host_reply' => 'Thank you so much Alex! You are welcome back anytime.',
                'host_replied_at' => now()->subDays(15),
            ]);

            // Upcoming confirmed booking
            Booking::create([
                'property_id' => $property->id,
                'guest_id' => $testUser->id,
                'check_in' => now()->addDays(10)->toDateString(),
                'check_out' => now()->addDays(14)->toDateString(),
                'guest_count' => 2,
                'nights' => 4,
                'price_per_night' => $property->price_per_night,
                'subtotal' => $property->price_per_night * 4,
                'cleaning_fee' => $property->cleaning_fee,
                'service_fee' => (int) round(($property->price_per_night * 4) * 0.14),
                'total_amount' => ($property->price_per_night * 4) + $property->cleaning_fee + (int) round(($property->price_per_night * 4) * 0.14),
                'status' => 'confirmed',
                'payment_status' => 'paid',
            ]);
        }
    }
}

