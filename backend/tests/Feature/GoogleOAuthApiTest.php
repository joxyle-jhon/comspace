<?php

use App\Models\User;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;

describe('Google OAuth API', function () {

    it('redirects to google for oauth consent', function () {
        config([
            'services.google.client_id' => 'test-client-id',
            'services.google.client_secret' => 'test-client-secret',
            'services.google.redirect' => 'http://127.0.0.1:8000/api/auth/google/callback',
        ]);

        $response = $this->get('/api/auth/google/redirect');

        $response->assertRedirect();
        expect($response->headers->get('Location'))->toContain('accounts.google.com');
    });

    it('creates a guest user and redirects to the frontend with a token', function () {
        config([
            'app.frontend_url' => 'http://localhost:3000',
            'services.google.client_id' => 'test-client-id',
            'services.google.client_secret' => 'test-client-secret',
            'services.google.redirect' => 'http://127.0.0.1:8000/api/auth/google/callback',
        ]);

        Socialite::fake('google', (new SocialiteUser)->map([
            'id' => 'google-user-123',
            'name' => 'Jane Google',
            'email' => 'jane.google@example.com',
            'avatar' => 'https://example.com/avatar.jpg',
        ]));

        $response = $this->get('/api/auth/google/callback');

        $response->assertRedirect();
        expect($response->headers->get('Location'))
            ->toStartWith('http://localhost:3000/auth/callback?token=');

        $user = User::where('email', 'jane.google@example.com')->first();

        expect($user)->not->toBeNull()
            ->and($user->google_id)->toBe('google-user-123')
            ->and($user->role)->toBe('guest')
            ->and($user->password)->toBeNull();
    });

    it('links an existing email account to google on callback', function () {
        config([
            'app.frontend_url' => 'http://localhost:3000',
            'services.google.client_id' => 'test-client-id',
            'services.google.client_secret' => 'test-client-secret',
            'services.google.redirect' => 'http://127.0.0.1:8000/api/auth/google/callback',
        ]);

        $existing = User::factory()->create([
            'email' => 'existing@example.com',
            'google_id' => null,
        ]);

        Socialite::fake('google', (new SocialiteUser)->map([
            'id' => 'google-linked-456',
            'name' => 'Existing User',
            'email' => 'existing@example.com',
            'avatar' => 'https://example.com/new-avatar.jpg',
        ]));

        $this->get('/api/auth/google/callback')->assertRedirect();

        $existing->refresh();

        expect($existing->google_id)->toBe('google-linked-456')
            ->and($existing->avatar)->toBe('https://example.com/new-avatar.jpg');
    });

    it('redirects to the frontend with an error when google auth fails', function () {
        config([
            'app.frontend_url' => 'http://localhost:3000',
            'services.google.client_id' => 'test-client-id',
            'services.google.client_secret' => 'test-client-secret',
            'services.google.redirect' => 'http://127.0.0.1:8000/api/auth/google/callback',
        ]);

        $response = $this->get('/api/auth/google/callback');

        $response->assertRedirect();
        expect($response->headers->get('Location'))
            ->toContain('http://localhost:3000/auth/callback?error=');
    });
});
