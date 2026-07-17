<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PropertyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                  => $this->id,
            'title'               => $this->title,
            'description'         => $this->description,
            'type'                => $this->type,
            'location' => [
                'address'     => $this->address,
                'city'        => $this->city,
                'state'       => $this->state,
                'country'     => $this->country,
                'postal_code' => $this->postal_code,
                'latitude'    => $this->latitude,
                'longitude'   => $this->longitude,
            ],
            'capacity' => [
                'max_guests' => $this->max_guests,
                'bedrooms'   => $this->bedrooms,
                'beds'       => $this->beds,
                'bathrooms'  => $this->bathrooms,
            ],
            'pricing' => [
                'price_per_night'    => $this->price_per_night,
                'price_formatted'    => $this->price_per_night_formatted,
                'cleaning_fee'       => $this->cleaning_fee,
                'service_fee_percent'=> $this->service_fee_percent,
            ],
            'rules' => [
                'min_nights'    => $this->min_nights,
                'max_nights'    => $this->max_nights,
                'instant_book'  => $this->instant_book,
            ],
            'stats' => [
                'average_rating' => $this->average_rating,
                'review_count'   => $this->review_count,
            ],
            'is_published'  => $this->is_published,
            'host'          => new UserResource($this->whenLoaded('host')),
            'images'        => PropertyImageResource::collection($this->whenLoaded('images')),
            'amenities'     => AmenityResource::collection($this->whenLoaded('amenities')),
            'created_at'    => $this->created_at->toISOString(),
            'updated_at'    => $this->updated_at->toISOString(),
        ];
    }
}
