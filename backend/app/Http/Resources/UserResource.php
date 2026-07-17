<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'name'           => $this->name,
            'email'          => $this->email,
            'role'           => $this->role,
            'avatar'         => $this->avatar,
            'phone'          => $this->phone,
            'country'        => $this->country,
            // Host fields — only included for hosts
            'bio'             => $this->when($this->isHost(), $this->bio),
            'is_verified_host'=> $this->when($this->isHost(), $this->is_verified_host),
            'host_since'      => $this->when($this->isHost(), $this->host_since?->toISOString()),
            'response_rate'   => $this->when($this->isHost(), $this->response_rate),
            'response_time'   => $this->when($this->isHost(), $this->response_time),
            'created_at'     => $this->created_at->toISOString(),
        ];
    }
}
