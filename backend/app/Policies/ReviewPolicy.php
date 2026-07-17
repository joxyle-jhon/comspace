<?php

namespace App\Policies;

use App\Models\Review;
use App\Models\User;

class ReviewPolicy
{
    public function reply(User $user, Review $review): bool
    {
        return $user->id === $review->property->user_id
            && is_null($review->host_reply);
    }

    public function delete(User $user, Review $review): bool
    {
        return $user->id === $review->guest_id;
    }
}
