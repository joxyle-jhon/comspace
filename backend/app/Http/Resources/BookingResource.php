<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'check_in'       => $this->check_in->toDateString(),
            'check_out'      => $this->check_out->toDateString(),
            'guest_count'    => $this->guest_count,
            'pricing' => [
                'nights'          => $this->nights,
                'price_per_night' => $this->price_per_night,
                'subtotal'        => $this->subtotal,
                'cleaning_fee'    => $this->cleaning_fee,
                'service_fee'     => $this->service_fee,
                'total_amount'    => $this->total_amount,
                'total_formatted' => $this->total_formatted,
            ],
            'status'         => $this->status,
            'payment_status' => $this->payment_status,
            'guest_note'     => $this->guest_note,
            'cancelled_at'   => $this->cancelled_at?->toISOString(),
            'property'       => new PropertyResource($this->whenLoaded('property')),
            'guest'          => new UserResource($this->whenLoaded('guest')),
            'review'         => new ReviewResource($this->whenLoaded('review')),
            'created_at'     => $this->created_at->toISOString(),
        ];
    }
}
