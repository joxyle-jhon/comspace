<?php

use App\Models\Booking;
use App\Models\Property;
use App\Models\User;
use App\Services\BookingService;
use Illuminate\Support\Facades\DB;

describe('BookingService conflict prevention', function () {

    beforeEach(function () {
        // Ensure fresh DB state
    });

    it('creates a booking when dates are fully available', function () {
        $host = User::factory()->create(['role' => 'host']);
        $guest = User::factory()->create(['role' => 'guest']);
        $property = Property::factory()->create([
            'user_id' => $host->id,
            'price_per_night' => 10000, // $100
            'cleaning_fee' => 2000,
            'min_nights' => 1,
            'max_nights' => 30,
            'max_guests' => 4,
            'instant_book' => true,
        ]);

        $service = app(BookingService::class);
        $booking = $service->createBooking(
            guest: $guest,
            property: $property,
            checkIn: '2025-12-01',
            checkOut: '2025-12-05',
            guestCount: 2
        );

        expect($booking)->toBeInstanceOf(Booking::class)
            ->and($booking->status)->toBe('confirmed')
            ->and($booking->nights)->toBe(4)
            ->and($booking->subtotal)->toBe(40000)   // 4 × $100
            ->and($booking->cleaning_fee)->toBe(2000)
            ->and($booking->property_id)->toBe($property->id);
    });

    it('prevents overlapping booking on the same property', function () {
        $host = User::factory()->create(['role' => 'host']);
        $guest1 = User::factory()->create(['role' => 'guest']);
        $guest2 = User::factory()->create(['role' => 'guest']);
        $property = Property::factory()->create([
            'user_id' => $host->id,
            'price_per_night' => 10000,
            'min_nights' => 1,
            'max_nights' => 30,
            'max_guests' => 4,
            'instant_book' => true,
        ]);

        $service = app(BookingService::class);

        // First booking succeeds
        $service->createBooking($guest1, $property, '2025-12-01', '2025-12-05', 2);

        // Second booking overlapping first should throw
        expect(fn () => $service->createBooking($guest2, $property, '2025-12-03', '2025-12-08', 2))
            ->toThrow(\Illuminate\Validation\ValidationException::class);
    });

    it('allows adjacent bookings (no overlap)', function () {
        $host = User::factory()->create(['role' => 'host']);
        $guest1 = User::factory()->create(['role' => 'guest']);
        $guest2 = User::factory()->create(['role' => 'guest']);
        $property = Property::factory()->create([
            'user_id' => $host->id,
            'price_per_night' => 10000,
            'min_nights' => 1,
            'max_nights' => 30,
            'max_guests' => 4,
            'instant_book' => true,
        ]);

        $service = app(BookingService::class);
        $service->createBooking($guest1, $property, '2025-12-01', '2025-12-05', 2);

        // Starts exactly when previous ends — no overlap
        $booking2 = $service->createBooking($guest2, $property, '2025-12-05', '2025-12-08', 2);

        expect($booking2)->toBeInstanceOf(Booking::class);
    });

    it('prevents booking when minimum nights not met', function () {
        $host = User::factory()->create(['role' => 'host']);
        $guest = User::factory()->create(['role' => 'guest']);
        $property = Property::factory()->create([
            'user_id' => $host->id,
            'price_per_night' => 10000,
            'min_nights' => 3,
            'max_nights' => 30,
            'max_guests' => 4,
        ]);

        expect(fn () => app(BookingService::class)->createBooking(
            $guest, $property, '2025-12-01', '2025-12-02', 1
        ))->toThrow(\Illuminate\Validation\ValidationException::class);
    });

    it('prevents booking exceeding guest capacity', function () {
        $host = User::factory()->create(['role' => 'host']);
        $guest = User::factory()->create(['role' => 'guest']);
        $property = Property::factory()->create([
            'user_id' => $host->id,
            'price_per_night' => 10000,
            'min_nights' => 1,
            'max_nights' => 30,
            'max_guests' => 2,
        ]);

        expect(fn () => app(BookingService::class)->createBooking(
            $guest, $property, '2025-12-01', '2025-12-05', 10 // exceeds max_guests
        ))->toThrow(\Illuminate\Validation\ValidationException::class);
    });

    it('calculates price correctly', function () {
        $property = Property::factory()->make([
            'price_per_night' => 15000, // $150
            'cleaning_fee' => 3000,     // $30
            'service_fee_percent' => 14,
            'min_nights' => 1,
            'max_nights' => 30,
        ]);

        $pricing = app(BookingService::class)->calculatePrice(
            $property, '2025-12-01', '2025-12-04' // 3 nights
        );

        expect($pricing['nights'])->toBe(3)
            ->and($pricing['subtotal'])->toBe(45000)                      // 3 × 15000
            ->and($pricing['cleaningFee'])->toBe(3000)
            ->and($pricing['serviceFee'])->toBe(6300)                     // 14% of 45000
            ->and($pricing['total'])->toBe(54300);                        // 45000+3000+6300
    });

    it('cancelled bookings do not block dates', function () {
        $host = User::factory()->create(['role' => 'host']);
        $guest1 = User::factory()->create(['role' => 'guest']);
        $guest2 = User::factory()->create(['role' => 'guest']);
        $property = Property::factory()->create([
            'user_id' => $host->id,
            'price_per_night' => 10000,
            'min_nights' => 1,
            'max_nights' => 30,
            'max_guests' => 4,
            'instant_book' => true,
        ]);

        $service = app(BookingService::class);
        $booking = $service->createBooking($guest1, $property, '2025-12-01', '2025-12-05', 2);

        // Cancel the booking
        $booking->update(['status' => 'cancelled']);

        // Now the same dates should be available
        $booking2 = $service->createBooking($guest2, $property, '2025-12-01', '2025-12-05', 2);
        expect($booking2)->toBeInstanceOf(Booking::class);
    });
});
