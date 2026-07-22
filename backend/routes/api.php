<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\HostController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\ReviewController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ─── Public Routes ─────────────────────────────────────────────────────────

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login'])
    ->middleware('throttle:5,1');

// Properties — public browsing
Route::get('/properties', [PropertyController::class, 'index']);
Route::get('/properties/{property}', [PropertyController::class, 'show']);
Route::get('/properties/{property}/reviews', [ReviewController::class, 'index'])
    ->withoutMiddleware(['auth:sanctum']);

// Price preview (public — guests check price before logging in)
Route::get('/properties/{property}/price-preview', [PropertyController::class, 'pricePreview']);

// ─── Authenticated Routes ───────────────────────────────────────────────────

Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/become-host', [AuthController::class, 'becomeHost']);

    // Properties — host actions
    Route::post('/properties', [PropertyController::class, 'store']);
    Route::put('/properties/{property}', [PropertyController::class, 'update']);
    Route::post('/properties/{property}/images', [PropertyController::class, 'uploadImages']);
    Route::patch('/properties/{property}/publish', [PropertyController::class, 'publish']);
    Route::delete('/properties/{property}', [PropertyController::class, 'destroy']);

    // Bookings
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/properties/{property}/bookings', [BookingController::class, 'store']);
    Route::get('/bookings/{booking}', [BookingController::class, 'show']);
    Route::patch('/bookings/{booking}/cancel', [BookingController::class, 'cancel']);
    Route::patch('/bookings/{booking}/confirm', [BookingController::class, 'confirm']);

    // Reviews
    Route::post('/bookings/{booking}/reviews', [ReviewController::class, 'store']);
    Route::post('/reviews/{review}/reply', [ReviewController::class, 'reply']);

    // Host Stats
    Route::get('/host/stats', [HostController::class, 'stats']);
});
