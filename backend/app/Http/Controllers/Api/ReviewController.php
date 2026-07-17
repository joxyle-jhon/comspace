<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReviewResource;
use App\Models\Booking;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ReviewController extends Controller
{
    /**
     * Get reviews for a property.
     */
    public function index(Request $request, int $propertyId): AnonymousResourceCollection
    {
        $reviews = Review::with('guest')
            ->where('property_id', $propertyId)
            ->orderByDesc('created_at')
            ->paginate(10);

        return ReviewResource::collection($reviews);
    }

    /**
     * Create a review — only for the guest of a completed, paid booking.
     */
    public function store(Request $request, Booking $booking): JsonResponse
    {
        $this->authorize('review', $booking);

        $data = $request->validate([
            'rating'               => ['required', 'integer', 'between:1,5'],
            'cleanliness_rating'   => ['nullable', 'integer', 'between:1,5'],
            'accuracy_rating'      => ['nullable', 'integer', 'between:1,5'],
            'communication_rating' => ['nullable', 'integer', 'between:1,5'],
            'location_rating'      => ['nullable', 'integer', 'between:1,5'],
            'value_rating'         => ['nullable', 'integer', 'between:1,5'],
            'comment'              => ['required', 'string', 'min:20', 'max:2000'],
        ]);

        $review = Review::create([
            ...$data,
            'booking_id'  => $booking->id,
            'property_id' => $booking->property_id,
            'guest_id'    => $request->user()->id,
        ]);

        // Update the property's denormalized rating stats
        $this->updatePropertyRating($booking->property_id);

        $review->load('guest');

        return response()->json(new ReviewResource($review), 201);
    }

    /**
     * Host replies to a review.
     */
    public function reply(Request $request, Review $review): ReviewResource
    {
        $this->authorize('reply', $review);

        $data = $request->validate([
            'reply' => ['required', 'string', 'max:1000'],
        ]);

        $review->update([
            'host_reply'      => $data['reply'],
            'host_replied_at' => now(),
        ]);

        return new ReviewResource($review->load('guest'));
    }

    private function updatePropertyRating(int $propertyId): void
    {
        $stats = Review::where('property_id', $propertyId)
            ->selectRaw('AVG(rating) as avg, COUNT(*) as cnt')
            ->first();

        \App\Models\Property::where('id', $propertyId)->update([
            'average_rating' => round((float) $stats->avg, 2),
            'review_count'   => (int) $stats->cnt,
        ]);
    }
}
