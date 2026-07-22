<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Models\Property;
use App\Services\BookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class BookingController extends Controller
{
    public function __construct(private BookingService $bookingService) {}

    /**
     * List the authenticated user's bookings.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $bookings = Booking::with(['property.images', 'property.host', 'review'])
            ->where('guest_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->paginate(10);

        return BookingResource::collection($bookings);
    }

    /**
     * Create a new booking.
     */
    public function store(Request $request, Property $property): JsonResponse
    {
        $data = $request->validate([
            'check_in' => ['required', 'date', 'after_or_equal:today'],
            'check_out' => ['required', 'date', 'after:check_in'],
            'guest_count' => ['required', 'integer', 'min:1'],
            'guest_note' => ['nullable', 'string', 'max:1000'],
        ]);

        $booking = $this->bookingService->createBooking(
            $request->user(),
            $property,
            $data['check_in'],
            $data['check_out'],
            $data['guest_count'],
            $data['guest_note'] ?? null
        );

        $booking->load(['property.images', 'property.host', 'guest']);

        return response()->json(new BookingResource($booking), 201);
    }

    /**
     * Show a single booking.
     */
    public function show(Booking $booking): BookingResource
    {
        $this->authorize('view', $booking);
        $booking->load(['property.images', 'property.host', 'guest', 'review.guest']);

        return new BookingResource($booking);
    }

    /**
     * Cancel a booking.
     */
    public function cancel(Request $request, Booking $booking): JsonResponse
    {
        $this->authorize('cancel', $booking);

        $data = $request->validate([
            'reason' => ['nullable', 'string', 'max:500'],
        ]);

        $booking->update([
            'status' => 'cancelled',
            'cancellation_reason' => $data['reason'] ?? null,
            'cancelled_at' => now(),
        ]);

        return response()->json(['message' => 'Booking cancelled.', 'booking' => new BookingResource($booking)]);
    }

    /**
     * Host confirms a pending booking.
     */
    public function confirm(Booking $booking): JsonResponse
    {
        $this->authorize('confirm', $booking);
        $booking->update(['status' => 'confirmed']);

        return response()->json(['message' => 'Booking confirmed.', 'booking' => new BookingResource($booking)]);
    }
}
