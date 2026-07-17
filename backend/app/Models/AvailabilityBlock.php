<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AvailabilityBlock extends Model
{
    use HasFactory;

    protected $fillable = ['property_id', 'blocked_from', 'blocked_to', 'reason'];

    protected function casts(): array
    {
        return [
            'blocked_from' => 'date',
            'blocked_to' => 'date',
        ];
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }
}
