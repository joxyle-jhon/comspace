<?php

use App\Models\Property;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;

describe('Property image upload', function () {

    it('uploads images for the property host to public storage', function () {
        Storage::fake('public');

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

        $storedPath = 'properties/'.$property->id;
        Storage::disk('public')->assertExists(
            collect(Storage::disk('public')->allFiles($storedPath))->first()
        );

        expect($property->fresh()->images)->toHaveCount(1)
            ->and($property->fresh()->images->first()->url)
            ->toContain('/storage/properties/'.$property->id.'/');
    });

    it('rejects upload when property already has 10 images', function () {
        Storage::fake('public');

        $host = User::factory()->create(['role' => 'host']);
        $property = Property::factory()->create(['user_id' => $host->id]);

        foreach (range(1, 10) as $i) {
            $property->images()->create([
                'url' => "/storage/properties/{$property->id}/photo-{$i}.jpg",
                'sort_order' => $i,
                'is_cover' => $i === 1,
            ]);
        }

        Sanctum::actingAs($host);

        $response = $this->postJson("/api/properties/{$property->id}/images", [
            'images' => [UploadedFile::fake()->image('extra.jpg')],
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['images']);
    });

    it('rejects invalid mime types', function () {
        Storage::fake('public');

        $host = User::factory()->create(['role' => 'host']);
        $property = Property::factory()->create(['user_id' => $host->id]);

        Sanctum::actingAs($host);

        $response = $this->postJson("/api/properties/{$property->id}/images", [
            'images' => [UploadedFile::fake()->create('notes.pdf', 100, 'application/pdf')],
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['images.0']);
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
