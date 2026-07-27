<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'google_id',
        'password',
        'role',
        'avatar',
        'phone',
        'country',
        'bio',
        'payout_email',
        'payout_method',
        'is_verified_host',
        'host_since',
        'response_rate',
        'response_time',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'payout_method',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'host_since' => 'datetime',
            'password' => 'hashed',
            'is_verified_host' => 'boolean',
        ];
    }

    // ─── Accessors ────────────────────────────────────────────────────────────

    public function isHost(): bool
    {
        return $this->role === 'host';
    }

    public function isGuest(): bool
    {
        return $this->role === 'guest';
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function properties(): HasMany
    {
        return $this->hasMany(Property::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class, 'guest_id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class, 'guest_id');
    }
}
