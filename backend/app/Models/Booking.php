<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'guest_id',
        'check_in',
        'check_out',
        'guest_count',
        'nights',
        'price_per_night',
        'subtotal',
        'cleaning_fee',
        'service_fee',
        'total_amount',
        'status',
        'cancellation_reason',
        'cancelled_at',
        'stripe_payment_intent_id',
        'stripe_charge_id',
        'payment_status',
        'guest_note',
        'host_note',
    ];

    protected function casts(): array
    {
        return [
            'check_in' => 'date',
            'check_out' => 'date',
            'cancelled_at' => 'datetime',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function guest(): BelongsTo
    {
        return $this->belongsTo(User::class, 'guest_id');
    }

    public function review(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(Review::class);
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function isCancelled(): bool
    {
        return $this->status === 'cancelled';
    }

    public function isPaid(): bool
    {
        return $this->payment_status === 'paid';
    }

    public function canBeReviewed(): bool
    {
        return $this->isCompleted() && $this->isPaid() && !$this->review()->exists();
    }

    /** Total amount formatted in dollars */
    public function getTotalFormattedAttribute(): string
    {
        return '$' . number_format($this->total_amount / 100, 2);
    }
}
