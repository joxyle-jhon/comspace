<?php

use App\Models\Booking;
use App\Models\Property;
use App\Models\User;
use App\Services\BookingService;

describe('BookingService conflict prevention', function () {

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

        $stay = stayWindow(nights: 4);

        $service = app(BookingService::class);
        $booking = $service->createBooking(
            guest: $guest,
            property: $property,
            checkIn: $stay['check_in'],
            checkOut: $stay['check_out'],
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

        $first = stayWindow(nights: 4);
        $overlapIn = now()->parse($first['check_in'])->addDays(2)->toDateString();
        $overlapOut = now()->parse($first['check_in'])->addDays(7)->toDateString();

        $service = app(BookingService::class);

        $service->createBooking($guest1, $property, $first['check_in'], $first['check_out'], 2);

        expect(fn () => $service->createBooking($guest2, $property, $overlapIn, $overlapOut, 2))
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

        $first = stayWindow(nights: 4);
        $adjacentIn = $first['check_out'];
        $adjacentOut = now()->parse($adjacentIn)->addDays(3)->toDateString();

        $service = app(BookingService::class);
        $service->createBooking($guest1, $property, $first['check_in'], $first['check_out'], 2);

        $booking2 = $service->createBooking(
            $guest2,
            $property,
            $adjacentIn,
            $adjacentOut,
            2
        );

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

        $tooShort = stayWindow(nights: 1);

        expect(fn () => app(BookingService::class)->createBooking(
            $guest, $property, $tooShort['check_in'], $tooShort['check_out'], 1
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

        $stay = stayWindow(nights: 4);

        expect(fn () => app(BookingService::class)->createBooking(
            $guest, $property, $stay['check_in'], $stay['check_out'], 10
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

        $stay = stayWindow(nights: 3);

        $pricing = app(BookingService::class)->calculatePrice(
            $property, $stay['check_in'], $stay['check_out']
        );

        expect($pricing['nights'])->toBe(3)
            ->and($pricing['subtotal'])->toBe(45000)
            ->and($pricing['cleaningFee'])->toBe(3000)
            ->and($pricing['serviceFee'])->toBe(6300)
            ->and($pricing['total'])->toBe(54300);
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

        $stay = stayWindow(nights: 4);

        $service = app(BookingService::class);
        $booking = $service->createBooking(
            $guest1,
            $property,
            $stay['check_in'],
            $stay['check_out'],
            2
        );

        $booking->update(['status' => 'cancelled']);

        $booking2 = $service->createBooking(
            $guest2,
            $property,
            $stay['check_in'],
            $stay['check_out'],
            2
        );
        expect($booking2)->toBeInstanceOf(Booking::class);
    });
});
