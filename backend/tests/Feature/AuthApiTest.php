<?php

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Laravel\Sanctum\PersonalAccessToken;

describe('Auth API', function () {

    beforeEach(function () {
        Cache::flush();
    });

    it('registers with valid data and returns a token', function () {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Ada Guest',
            'email' => 'ada@example.com',
            'password' => 'Password123',
            'role' => 'guest',
        ]);

        $response->assertCreated()
            ->assertJsonStructure([
                'user' => ['id', 'name', 'email', 'role'],
                'token',
            ])
            ->assertJsonPath('user.email', 'ada@example.com')
            ->assertJsonPath('user.role', 'guest');

        expect($response->json('token'))->toBeString()->not->toBeEmpty()
            ->and(User::where('email', 'ada@example.com')->exists())->toBeTrue();
    });

    it('rejects login with invalid credentials', function () {
        User::factory()->create([
            'email' => 'ada@example.com',
            'password' => 'Password123',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'ada@example.com',
            'password' => 'WrongPass1',
        ]);

        $response->assertUnauthorized()
            ->assertJsonPath('success', false)
            ->assertJsonPath('error.code', 'INVALID_CREDENTIALS');
    });

    it('rejects login with invalid payload as validation error', function () {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'not-an-email',
        ]);

        $response->assertUnprocessable()
            ->assertJsonPath('success', false)
            ->assertJsonPath('error.code', 'VALIDATION_ERROR');
    });

    it('rate limits login after five attempts', function () {
        User::factory()->create([
            'email' => 'ada@example.com',
            'password' => 'Password123',
        ]);

        $payload = [
            'email' => 'ada@example.com',
            'password' => 'WrongPass1',
        ];

        foreach (range(1, 5) as $attempt) {
            $this->postJson('/api/auth/login', $payload)
                ->assertUnauthorized();
        }

        $this->postJson('/api/auth/login', $payload)
            ->assertStatus(429)
            ->assertJsonPath('success', false)
            ->assertJsonPath('error.code', 'TOO_MANY_REQUESTS');
    });

    it('logout invalidates the current token', function () {
        $user = User::factory()->create([
            'email' => 'ada@example.com',
            'password' => 'Password123',
        ]);

        $plainTextToken = $user->createToken('api-token')->plainTextToken;
        $tokenId = (int) explode('|', $plainTextToken, 2)[0];

        $this->withToken($plainTextToken)
            ->postJson('/api/auth/logout')
            ->assertOk()
            ->assertJsonPath('message', 'Logged out successfully.');

        expect(PersonalAccessToken::find($tokenId))->toBeNull();

        Auth::forgetGuards();

        $this->withToken($plainTextToken)
            ->getJson('/api/auth/me')
            ->assertUnauthorized()
            ->assertJsonPath('error.code', 'AUTHENTICATION_REQUIRED');
    });
});
