<?php

use App\Models\Property;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Laravel\Sanctum\Sanctum;

describe('Property image upload (Supabase)', function () {

    it('uploads images for the property host', function () {
        config([
            'supabase.url' => 'https://example.supabase.co',
            'supabase.service_key' => 'test-service-key',
            'supabase.storage_bucket' => 'comspace-images',
        ]);

        Http::fake([
            'https://example.supabase.co/storage/v1/object/*' => Http::response(['Key' => 'ok'], 200),
        ]);

        $host = User::factory()->create(['role' => 'host']);
        $property = Property::factory()->create(['user_id' => $host->id]);

        Sanctum::actingAs($host);

        $file = UploadedFile::fake()->image('villa.jpg', 800, 600);

        $response = $this->post("/api/properties/{$property->id}/images", [
            'images' => [$file],
        ], [
            'Accept' => 'application/json',
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.0.is_cover', true);

        expect($property->fresh()->images)->toHaveCount(1)
            ->and($property->fresh()->images->first()->url)
            ->toContain('https://example.supabase.co/storage/v1/object/public/comspace-images/properties/');
    });

    it('rejects upload when property already has 10 images', function () {
        config([
            'supabase.url' => 'https://example.supabase.co',
            'supabase.service_key' => 'test-service-key',
            'supabase.storage_bucket' => 'comspace-images',
        ]);

        $host = User::factory()->create(['role' => 'host']);
        $property = Property::factory()->create(['user_id' => $host->id]);

        foreach (range(1, 10) as $i) {
            $property->images()->create([
                'url' => "https://example.supabase.co/storage/v1/object/public/comspace-images/p/{$i}.jpg",
                'sort_order' => $i,
                'is_cover' => $i === 1,
            ]);
        }

        Sanctum::actingAs($host);

        $response = $this->postJson("/api/properties/{$property->id}/images", [
            'images' => [UploadedFile::fake()->image('extra.jpg')],
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['images']);
    });

    it('forbids guests from uploading images', function () {
        $host = User::factory()->create(['role' => 'host']);
        $guest = User::factory()->create(['role' => 'guest']);
        $property = Property::factory()->create(['user_id' => $host->id]);

        Sanctum::actingAs($guest);

        $response = $this->postJson("/api/properties/{$property->id}/images", [
            'images' => [UploadedFile::fake()->image('nope.jpg')],
        ]);

        $response->assertForbidden();
    });
});
