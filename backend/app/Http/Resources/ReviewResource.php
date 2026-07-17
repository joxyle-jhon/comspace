<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'      => $this->id,
            'rating'  => $this->rating,
            'ratings' => [
                'cleanliness'  => $this->cleanliness_rating,
                'accuracy'     => $this->accuracy_rating,
                'communication'=> $this->communication_rating,
                'location'     => $this->location_rating,
                'value'        => $this->value_rating,
            ],
            'comment'         => $this->comment,
            'host_reply'      => $this->host_reply,
            'host_replied_at' => $this->host_replied_at?->toISOString(),
            'guest'           => new UserResource($this->whenLoaded('guest')),
            'created_at'      => $this->created_at->toISOString(),
        ];
    }
}
