<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\GoogleOAuthService;
use GuzzleHttp\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Contracts\Provider as SocialiteProvider;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function __construct(private GoogleOAuthService $googleOAuth) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $data = $request->validated();

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'] ?? 'guest',
            'host_since' => isset($data['role']) && $data['role'] === 'host' ? now() : null,
        ]);

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token,
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $data = $request->validated();

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'INVALID_CREDENTIALS',
                    'message' => 'Invalid credentials.',
                ],
            ], 401);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token,
        ]);
    }

    /**
     * Redirect the user to Google's OAuth consent screen.
     */
    public function redirectToGoogle(): RedirectResponse
    {
        return $this->googleDriver()->redirect();
    }

    /**
     * Handle the Google OAuth callback and redirect to the frontend with a token.
     */
    public function handleGoogleCallback(Request $request): RedirectResponse
    {
        $frontendUrl = rtrim(config('app.frontend_url'), '/');

        try {
            $googleUser = $this->googleDriver()->user();
            $user = $this->googleOAuth->findOrCreateUser($googleUser);
            $token = $user->createToken('api-token')->plainTextToken;

            return redirect()->away(
                $frontendUrl.'/auth/callback?token='.urlencode($token)
            );
        } catch (\Throwable $exception) {
            Log::error('Google OAuth callback failed', [
                'message' => $exception->getMessage(),
                'exception' => $exception::class,
            ]);

            $message = config('app.debug')
                ? 'Google sign-in failed: '.$exception->getMessage()
                : 'Google sign-in failed. Please try again.';

            return redirect()->away(
                $frontendUrl.'/auth/callback?error='.urlencode($message)
            );
        }
    }

    /**
     * Build a stateless Google Socialite driver (local dev may skip SSL verify on Windows).
     */
    private function googleDriver(): SocialiteProvider
    {
        $driver = Socialite::driver('google')->stateless();

        if (app()->environment('local') && ! ini_get('curl.cainfo')) {
            $driver->setHttpClient(new Client(['verify' => false]));
        }

        return $driver;
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully.']);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(new UserResource($request->user()));
    }

    public function becomeHost(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->update([
            'role' => 'host',
            'host_since' => now(),
        ]);

        return response()->json([
            'message' => 'Role updated to host successfully.',
            'user' => new UserResource($user),
        ]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,'.$user->id],
        ]);

        $user->update($data);

        return response()->json([
            'message' => 'Profile updated successfully.',
            'user' => new UserResource($user),
        ]);
    }

    public function updatePassword(Request $request): JsonResponse
    {
        $data = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = $request->user();

        if (! Hash::check($data['current_password'], $user->password)) {
            return response()->json([
                'message' => 'Current password does not match our records.',
            ], 422);
        }

        $user->update([
            'password' => Hash::make($data['password']),
        ]);

        return response()->json([
            'message' => 'Password changed successfully.',
        ]);
    }
}
