<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AvailabilityBlockResource;
use App\Models\AvailabilityBlock;
use App\Models\Property;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AvailabilityController extends Controller
{
    /**
     * Block off dates for a property (hosts only).
     *
     * @throws ValidationException
     */
    public function store(Request $request, Property $property): JsonResponse
    {
        // 1. Authorize that user can update this property (i.e. is the owner)
        $this->authorize('update', $property);

        // 2. Validate request parameters
        $data = $request->validate([
            'blocked_from' => ['required', 'date', 'after_or_equal:today'],
            'blocked_to' => ['required', 'date', 'after:blocked_from'],
            'reason' => ['nullable', 'string', 'max:255'],
        ]);

        $blockedFrom = $data['blocked_from'];
        $blockedTo = $data['blocked_to'];

        // 3. Prevent blocking dates that overlap with active bookings (confirmed or pending)
        $bookingConflict = $property->bookings()
            ->whereIn('status', ['confirmed', 'pending'])
            ->whereDate('check_in', '<', $blockedTo)
            ->whereDate('check_out', '>', $blockedFrom)
            ->exists();

        if ($bookingConflict) {
            throw ValidationException::withMessages([
                'blocked_from' => 'Cannot block dates that have active bookings.',
            ]);
        }

        // 4. Prevent blocking dates that are already blocked by another block
        $blockConflict = $property->availabilityBlocks()
            ->whereDate('blocked_from', '<', $blockedTo)
            ->whereDate('blocked_to', '>', $blockedFrom)
            ->exists();

        if ($blockConflict) {
            throw ValidationException::withMessages([
                'blocked_from' => 'These dates are already blocked.',
            ]);
        }

        // 5. Create the block
        $block = $property->availabilityBlocks()->create([
            'blocked_from' => $blockedFrom,
            'blocked_to' => $blockedTo,
            'reason' => $data['reason'] ?? null,
        ]);

        return response()->json(new AvailabilityBlockResource($block), 201);
    }

    /**
     * Delete an availability block (hosts only).
     */
    public function destroy(Request $request, AvailabilityBlock $availabilityBlock): JsonResponse
    {
        // Authorize: check if user owns the property of this availability block
        $this->authorize('update', $availabilityBlock->property);

        $availabilityBlock->delete();

        return response()->json(['message' => 'Availability block deleted.']);
    }
}
