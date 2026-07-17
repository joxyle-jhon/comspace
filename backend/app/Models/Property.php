<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Property extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'type',
        'address',
        'city',
        'state',
        'country',
        'postal_code',
        'latitude',
        'longitude',
        'max_guests',
        'bedrooms',
        'beds',
        'bathrooms',
        'price_per_night',
        'cleaning_fee',
        'service_fee_percent',
        'min_nights',
        'max_nights',
        'instant_book',
        'is_published',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'float',
            'longitude' => 'float',
            'instant_book' => 'boolean',
            'is_published' => 'boolean',
            'is_active' => 'boolean',
            'average_rating' => 'float',
        ];
    }

    // ─── Accessors ────────────────────────────────────────────────────────────

    /** Price in dollars for display */
    public function getPricePerNightFormattedAttribute(): string
    {
        return '$' . number_format($this->price_per_night / 100, 2);
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function host(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(PropertyImage::class)->orderBy('sort_order');
    }

    public function coverImage(): HasMany
    {
        return $this->hasMany(PropertyImage::class)->where('is_cover', true)->limit(1);
    }

    public function amenities(): BelongsToMany
    {
        return $this->belongsToMany(Amenity::class, 'amenity_property');
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function availabilityBlocks(): HasMany
    {
        return $this->hasMany(AvailabilityBlock::class);
    }

    // ─── Query Scopes ─────────────────────────────────────────────────────────

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true)->where('is_active', true);
    }

    public function scopeInCity(Builder $query, string $city): Builder
    {
        return $query->whereRaw('LOWER(city) LIKE ?', ['%' . strtolower($city) . '%']);
    }

    public function scopeInCountry(Builder $query, string $country): Builder
    {
        return $query->whereRaw('LOWER(country) LIKE ?', ['%' . strtolower($country) . '%']);
    }

    public function scopeForGuests(Builder $query, int $guests): Builder
    {
        return $query->where('max_guests', '>=', $guests);
    }

    public function scopePriceBetween(Builder $query, int $min, int $max): Builder
    {
        return $query->whereBetween('price_per_night', [$min, $max]);
    }

    public function scopeWithAmenities(Builder $query, array $amenityIds): Builder
    {
        return $query->whereHas('amenities', fn ($q) => $q->whereIn('amenities.id', $amenityIds));
    }

    /**
     * Exclude properties that have confirmed/pending bookings overlapping the given dates.
     * Uses the standard interval overlap condition: A.start < B.end AND A.end > B.start
     */
    public function scopeAvailableForDates(Builder $query, string $checkIn, string $checkOut): Builder
    {
        return $query->whereDoesntHave('bookings', function (Builder $q) use ($checkIn, $checkOut) {
            $q->whereIn('status', ['confirmed', 'pending'])
              ->where('check_in', '<', $checkOut)
              ->where('check_out', '>', $checkIn);
        })->whereDoesntHave('availabilityBlocks', function (Builder $q) use ($checkIn, $checkOut) {
            $q->where('blocked_from', '<', $checkOut)
              ->where('blocked_to', '>', $checkIn);
        });
    }
}
