<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PropertyImageResource;
use App\Http\Resources\PropertyResource;
use App\Models\Property;
use App\Models\PropertyImage;
use App\Services\SupabaseStorageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\ValidationException;

class PropertyController extends Controller
{
    /**
     * Browse/search properties with filtering.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Property::published()
            ->with(['images', 'amenities', 'host']);

        // Location filter
        if ($location = $request->get('location')) {
            $query->where(function ($q) use ($location) {
                $q->inCity($location)->orWhere(function ($q2) use ($location) {
                    $q2->inCountry($location);
                });
            });
        }

        // Guest count
        if ($guests = $request->integer('guests')) {
            $query->forGuests($guests);
        }

        // Date availability
        if ($request->filled(['check_in', 'check_out'])) {
            $query->availableForDates($request->get('check_in'), $request->get('check_out'));
        }

        // Price range (values in cents from frontend)
        if ($request->filled('min_price')) {
            $query->where('price_per_night', '>=', $request->integer('min_price'));
        }
        if ($request->filled('max_price')) {
            $query->where('price_per_night', '<=', $request->integer('max_price'));
        }

        // Amenities
        if ($amenities = $request->get('amenities')) {
            $ids = is_array($amenities) ? $amenities : explode(',', $amenities);
            $query->withAmenities(array_map('intval', $ids));
        }

        // Property type
        if ($type = $request->get('type')) {
            $query->where('type', $type);
        }

        // Instant book
        if ($request->boolean('instant_book')) {
            $query->where('instant_book', true);
        }

        // Sorting
        $sort = $request->get('sort', 'created_at');
        $dir  = $request->get('dir', 'desc');
        $allowed = ['price_per_night', 'average_rating', 'created_at'];
        if (in_array($sort, $allowed)) {
            $query->orderBy($sort, $dir === 'asc' ? 'asc' : 'desc');
        }

        $properties = $query->paginate($request->integer('per_page', 12));

        return PropertyResource::collection($properties);
    }

    /**
     * Get a single property detail page.
     */
    public function show(Property $property): PropertyResource
    {
        $property->load(['images', 'amenities', 'host', 'reviews.guest']);

        return new PropertyResource($property);
    }

    /**
     * Create a new property (hosts only).
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', Property::class);

        $data = $request->validate([
            'title'              => ['required', 'string', 'max:255'],
            'description'        => ['required', 'string', 'min:50'],
            'type'               => ['required', 'in:apartment,house,villa,cabin,studio,loft,condo,other'],
            'address'            => ['required', 'string'],
            'city'               => ['required', 'string'],
            'state'              => ['nullable', 'string'],
            'country'            => ['required', 'string'],
            'postal_code'        => ['nullable', 'string'],
            'latitude'           => ['nullable', 'numeric', 'between:-90,90'],
            'longitude'          => ['nullable', 'numeric', 'between:-180,180'],
            'max_guests'         => ['required', 'integer', 'min:1', 'max:50'],
            'bedrooms'           => ['required', 'integer', 'min:0'],
            'beds'               => ['required', 'integer', 'min:1'],
            'bathrooms'          => ['required', 'integer', 'min:1'],
            'price_per_night'    => ['required', 'integer', 'min:100'], // min $1
            'cleaning_fee'       => ['sometimes', 'integer', 'min:0'],
            'service_fee_percent'=> ['sometimes', 'integer', 'min:0', 'max:50'],
            'min_nights'         => ['sometimes', 'integer', 'min:1'],
            'max_nights'         => ['sometimes', 'integer', 'min:1', 'max:365'],
            'instant_book'       => ['sometimes', 'boolean'],
            'amenity_ids'        => ['sometimes', 'array'],
            'amenity_ids.*'      => ['integer', 'exists:amenities,id'],
        ]);

        $property = $request->user()->properties()->create(
            collect($data)->except('amenity_ids')->toArray()
        );

        if (!empty($data['amenity_ids'])) {
            $property->amenities()->sync($data['amenity_ids']);
        }

        $property->load(['images', 'amenities', 'host']);

        return response()->json(new PropertyResource($property), 201);
    }

    /**
     * Update a property.
     */
    public function update(Request $request, Property $property): PropertyResource
    {
        $this->authorize('update', $property);

        $data = $request->validate([
            'title'              => ['sometimes', 'string', 'max:255'],
            'description'        => ['sometimes', 'string', 'min:50'],
            'type'               => ['sometimes', 'in:apartment,house,villa,cabin,studio,loft,condo,other'],
            'address'            => ['sometimes', 'string'],
            'city'               => ['sometimes', 'string'],
            'state'              => ['nullable', 'string'],
            'country'            => ['sometimes', 'string'],
            'postal_code'        => ['nullable', 'string'],
            'latitude'           => ['nullable', 'numeric', 'between:-90,90'],
            'longitude'          => ['nullable', 'numeric', 'between:-180,180'],
            'max_guests'         => ['sometimes', 'integer', 'min:1'],
            'bedrooms'           => ['sometimes', 'integer', 'min:0'],
            'beds'               => ['sometimes', 'integer', 'min:1'],
            'bathrooms'          => ['sometimes', 'integer', 'min:1'],
            'price_per_night'    => ['sometimes', 'integer', 'min:100'],
            'cleaning_fee'       => ['sometimes', 'integer', 'min:0'],
            'min_nights'         => ['sometimes', 'integer', 'min:1'],
            'max_nights'         => ['sometimes', 'integer', 'min:1'],
            'instant_book'       => ['sometimes', 'boolean'],
            'amenity_ids'        => ['sometimes', 'array'],
            'amenity_ids.*'      => ['integer', 'exists:amenities,id'],
        ]);

        $property->update(collect($data)->except('amenity_ids')->toArray());

        if (array_key_exists('amenity_ids', $data)) {
            $property->amenities()->sync($data['amenity_ids']);
        }

        $property->load(['images', 'amenities', 'host']);

        return new PropertyResource($property);
    }

    /**
     * Publish or unpublish a property.
     */
    public function publish(Request $request, Property $property): JsonResponse
    {
        $this->authorize('publish', $property);

        $data = $request->validate(['published' => ['required', 'boolean']]);
        $property->update(['is_published' => $data['published']]);

        return response()->json([
            'is_published' => $property->is_published,
            'message' => $property->is_published ? 'Property published.' : 'Property unpublished.',
        ]);
    }

    /**
     * Upload property images to Supabase Storage (host only, max 10 total).
     */
    public function uploadImages(
        Request $request,
        Property $property,
        SupabaseStorageService $storage
    ): JsonResponse {
        $this->authorize('update', $property);

        $data = $request->validate([
            'images' => ['required', 'array', 'min:1'],
            'images.*' => ['file', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'captions' => ['sometimes', 'array'],
            'captions.*' => ['nullable', 'string', 'max:255'],
            'cover_index' => ['sometimes', 'integer', 'min:0'],
        ]);

        $existingCount = $property->images()->count();
        $incomingCount = count($data['images']);

        if ($existingCount + $incomingCount > 10) {
            throw ValidationException::withMessages([
                'images' => 'A property may have at most 10 images.',
            ]);
        }

        $startOrder = (int) $property->images()->max('sort_order');
        $created = [];
        $coverIndex = $data['cover_index'] ?? null;
        $hasCover = $property->images()->where('is_cover', true)->exists();

        foreach ($data['images'] as $index => $file) {
            $url = $storage->upload($file, "properties/{$property->id}");

            $isCover = false;
            if ($coverIndex !== null && (int) $coverIndex === $index) {
                $property->images()->update(['is_cover' => false]);
                $isCover = true;
            } elseif (!$hasCover && $index === 0 && $existingCount === 0) {
                $isCover = true;
            }

            $created[] = PropertyImage::create([
                'property_id' => $property->id,
                'url' => $url,
                'caption' => $data['captions'][$index] ?? null,
                'sort_order' => $startOrder + $index + 1,
                'is_cover' => $isCover,
            ]);
        }

        return response()->json([
            'data' => PropertyImageResource::collection(collect($created)),
        ], 201);
    }

    /**
     * Delete a property.
     */
    public function destroy(Property $property): JsonResponse
    {
        $this->authorize('delete', $property);
        $property->delete();

        return response()->json(['message' => 'Property deleted.']);
    }
}
