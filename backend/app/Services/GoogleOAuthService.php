<?php

namespace App\Services;

use App\Models\User;
use Laravel\Socialite\Contracts\User as SocialiteUser;

class GoogleOAuthService
{
    /**
     * Find an existing user by Google ID or email, or create a new guest account.
     */
    public function findOrCreateUser(SocialiteUser $googleUser): User
    {
        $user = User::query()
            ->where('google_id', $googleUser->getId())
            ->first();

        if (! $user) {
            $user = User::query()
                ->where('email', $googleUser->getEmail())
                ->first();
        }

        if ($user) {
            $user->update([
                'google_id' => $googleUser->getId(),
                'name' => $googleUser->getName() ?? $user->name,
                'avatar' => $googleUser->getAvatar() ?? $user->avatar,
                'email_verified_at' => $user->email_verified_at ?? now(),
            ]);

            return $user->fresh();
        }

        return User::create([
            'name' => $googleUser->getName() ?? 'Google User',
            'email' => $googleUser->getEmail(),
            'google_id' => $googleUser->getId(),
            'avatar' => $googleUser->getAvatar(),
            'role' => 'guest',
            'email_verified_at' => now(),
        ]);
    }
}
