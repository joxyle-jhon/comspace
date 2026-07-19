<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Models\Property;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HostController extends Controller
{
    /**
     * Get host dashboard statistics.
     */
    public function stats(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isHost()) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'FORBIDDEN',
                    'message' => 'Only hosts can access host dashboard stats.'
                ]
            ], 403);
        }

        $propertyIds = Property::where('user_id', $user->id)->pluck('id');

        $totalProperties = $propertyIds->count();

        $bookingsQuery = Booking::whereIn('property_id', $propertyIds);
        $totalBookings = (clone $bookingsQuery)->count();
        $pendingBookings = (clone $bookingsQuery)->where('status', 'pending')->count();

        $totalRevenue = (clone $bookingsQuery)
            ->whereIn('status', ['confirmed', 'completed'])
            ->sum('total_amount');

        $avgRating = Review::whereIn('property_id', $propertyIds)->avg('rating') ?: 0.0;
        $avgRating = round((float) $avgRating, 2);

        $recentBookings = Booking::whereIn('property_id', $propertyIds)
            ->with(['property', 'guest'])
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        $upcomingArrivals = Booking::whereIn('property_id', $propertyIds)
            ->with(['property', 'guest'])
            ->where('status', 'confirmed')
            ->where('check_in', '>=', now()->toDateString())
            ->where('check_in', '<=', now()->addDays(7)->toDateString())
            ->orderBy('check_in', 'asc')
            ->get();

        return response()->json([
            'total_properties' => $totalProperties,
            'total_bookings' => $totalBookings,
            'total_revenue' => $totalRevenue,
            'pending_bookings' => $pendingBookings,
            'avg_rating' => $avgRating,
            'recent_bookings' => BookingResource::collection($recentBookings),
            'upcoming_arrivals' => BookingResource::collection($upcomingArrivals),
        ]);
    }
}
