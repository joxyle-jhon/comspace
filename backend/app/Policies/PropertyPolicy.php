<?php

namespace App\Policies;

use App\Models\Property;
use App\Models\User;

class PropertyPolicy
{
    public function create(User $user): bool
    {
        return $user->isHost();
    }

    public function update(User $user, Property $property): bool
    {
        return $user->id === $property->user_id;
    }

    public function delete(User $user, Property $property): bool
    {
        return $user->id === $property->user_id;
    }

    public function publish(User $user, Property $property): bool
    {
        return $user->id === $property->user_id;
    }
}
