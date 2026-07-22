<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Property;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class BookingService
{
    /**
     * Calculate the price breakdown for a potential booking.
     * All amounts returned in CENTS.
     */
    public function calculatePrice(Property $property, string $checkIn, string $checkOut): array
    {
        $nights = (int) now()->parse($checkIn)->diffInDays(now()->parse($checkOut));

        if ($nights < 1) {
            throw ValidationException::withMessages([
                'check_out' => 'Check-out must be at least one night after check-in.',
            ]);
        }

        if ($nights < $property->min_nights) {
            throw ValidationException::withMessages([
                'check_in' => "Minimum stay is {$property->min_nights} nights.",
            ]);
        }

        if ($nights > $property->max_nights) {
            throw ValidationException::withMessages([
                'check_out' => "Maximum stay is {$property->max_nights} nights.",
            ]);
        }

        $subtotal    = $property->price_per_night * $nights;
        $cleaningFee = $property->cleaning_fee;
        $serviceFee  = (int) round($subtotal * ($property->service_fee_percent / 100));
        $total       = $subtotal + $cleaningFee + $serviceFee;

        return compact('nights', 'subtotal', 'cleaningFee', 'serviceFee', 'total');
    }

    /**
     * Attempt to create a booking with conflict prevention.
     *
     * Uses a DB transaction + SELECT FOR UPDATE NO KEY UPDATE on the property row
     * to prevent race conditions on the same property.
     *
     * @throws ValidationException when dates conflict or validation fails.
     */
    public function createBooking(
        User $guest,
        Property $property,
        string $checkIn,
        string $checkOut,
        int $guestCount,
        ?string $guestNote = null
    ): Booking {
        if ($guest->id === $property->user_id) {
            throw ValidationException::withMessages([
                'property' => 'You cannot book your own property.',
            ]);
        }

        if ($guestCount > $property->max_guests) {
            throw ValidationException::withMessages([
                'guest_count' => "This property accommodates a maximum of {$property->max_guests} guests.",
            ]);
        }

        return DB::transaction(function () use ($guest, $property, $checkIn, $checkOut, $guestCount, $guestNote) {
            // Normalize to Y-m-d so SQLite datetime storage does not break adjacent-day comparisons.
            $checkIn = now()->parse($checkIn)->toDateString();
            $checkOut = now()->parse($checkOut)->toDateString();

            // Serialize concurrent booking attempts on the same property.
            // Postgres: FOR NO KEY UPDATE. SQLite/tests: Eloquent lockForUpdate().
            if (DB::getDriverName() === 'pgsql') {
                DB::statement(
                    'SELECT id FROM properties WHERE id = ? FOR NO KEY UPDATE',
                    [$property->id]
                );
            } else {
                Property::query()->whereKey($property->id)->lockForUpdate()->first();
            }

            // Check for overlapping confirmed/pending bookings
            $conflict = Booking::where('property_id', $property->id)
                ->whereIn('status', ['confirmed', 'pending'])
                ->whereDate('check_in', '<', $checkOut)
                ->whereDate('check_out', '>', $checkIn)
                ->lockForUpdate()
                ->exists();

            if ($conflict) {
                throw ValidationException::withMessages([
                    'check_in' => 'These dates are no longer available. Please select different dates.',
                ]);
            }

            // Also check host-blocked dates
            $blocked = $property->availabilityBlocks()
                ->whereDate('blocked_from', '<', $checkOut)
                ->whereDate('blocked_to', '>', $checkIn)
                ->exists();

            if ($blocked) {
                throw ValidationException::withMessages([
                    'check_in' => 'The host has blocked these dates.',
                ]);
            }

            // Calculate price server-side
            $pricing = $this->calculatePrice($property, $checkIn, $checkOut);

            $status = $property->instant_book ? 'confirmed' : 'pending';

            return Booking::create([
                'property_id'     => $property->id,
                'guest_id'        => $guest->id,
                'check_in'        => $checkIn,
                'check_out'       => $checkOut,
                'guest_count'     => $guestCount,
                'nights'          => $pricing['nights'],
                'price_per_night' => $property->price_per_night,
                'subtotal'        => $pricing['subtotal'],
                'cleaning_fee'    => $pricing['cleaningFee'],
                'service_fee'     => $pricing['serviceFee'],
                'total_amount'    => $pricing['total'],
                'status'          => $status,
                'payment_status'  => 'unpaid',
                'guest_note'      => $guestNote,
            ]);
        });
    }
}
