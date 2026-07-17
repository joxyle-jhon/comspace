<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'property_id',
        'guest_id',
        'rating',
        'cleanliness_rating',
        'accuracy_rating',
        'communication_rating',
        'location_rating',
        'value_rating',
        'comment',
        'host_reply',
        'host_replied_at',
    ];

    protected function casts(): array
    {
        return [
            'host_replied_at' => 'datetime',
        ];
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function guest(): BelongsTo
    {
        return $this->belongsTo(User::class, 'guest_id');
    }
}
