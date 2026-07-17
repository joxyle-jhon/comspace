<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookingFactory extends Factory
{
    protected $model = Booking::class;

    public function definition(): array
    {
        $checkIn = now()->addDays(5)->toDateString();
        $checkOut = now()->addDays(8)->toDateString();

        return [
            'property_id' => Property::factory(),
            'guest_id' => User::factory(),
            'check_in' => $checkIn,
            'check_out' => $checkOut,
            'guest_count' => 2,
            'nights' => 3,
            'price_per_night' => 10000,
            'subtotal' => 30000,
            'cleaning_fee' => 2000,
            'service_fee' => 4200,
            'total_amount' => 36200,
            'status' => 'pending',
            'payment_status' => 'unpaid',
        ];
    }
}
