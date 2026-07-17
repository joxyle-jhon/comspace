<?php

namespace App\Policies;

use App\Models\Booking;
use App\Models\User;

class BookingPolicy
{
    public function view(User $user, Booking $booking): bool
    {
        return $user->id === $booking->guest_id
            || $user->id === $booking->property->user_id;
    }

    public function cancel(User $user, Booking $booking): bool
    {
        return $user->id === $booking->guest_id
            && in_array($booking->status, ['pending', 'confirmed']);
    }

    public function confirm(User $user, Booking $booking): bool
    {
        return $user->id === $booking->property->user_id
            && $booking->status === 'pending';
    }

    public function review(User $user, Booking $booking): bool
    {
        return $user->id === $booking->guest_id
            && $booking->isCompleted()
            && $booking->isPaid()
            && !$booking->review()->exists();
    }
}
