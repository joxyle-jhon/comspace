<?php

use App\Models\AvailabilityBlock;
use App\Models\Booking;
use App\Models\Property;
use App\Models\User;

describe('Availability Block API', function () {

    it('returns 401 for unauthenticated users', function () {
        $host = User::factory()->create(['role' => 'host']);
        $property = Property::factory()->create(['user_id' => $host->id]);

        $response = $this->postJson("/api/properties/{$property->id}/availability", [
            'blocked_from' => now()->addDays(5)->toDateString(),
            'blocked_to' => now()->addDays(10)->toDateString(),
            'reason' => 'Maintenance',
        ]);

        $response->assertUnauthorized();
    });

    it('returns 403 for authenticated guests', function () {
        $host = User::factory()->create(['role' => 'host']);
        $guest = User::factory()->create(['role' => 'guest']);
        $property = Property::factory()->create(['user_id' => $host->id]);

        $response = $this->actingAs($guest)->postJson("/api/properties/{$property->id}/availability", [
            'blocked_from' => now()->addDays(5)->toDateString(),
            'blocked_to' => now()->addDays(10)->toDateString(),
            'reason' => 'Maintenance',
        ]);

        $response->assertForbidden();
    });

    it('returns 403 for a host who does not own the property', function () {
        $host1 = User::factory()->create(['role' => 'host']);
        $host2 = User::factory()->create(['role' => 'host']);
        $property = Property::factory()->create(['user_id' => $host1->id]);

        $response = $this->actingAs($host2)->postJson("/api/properties/{$property->id}/availability", [
            'blocked_from' => now()->addDays(5)->toDateString(),
            'blocked_to' => now()->addDays(10)->toDateString(),
            'reason' => 'Maintenance',
        ]);

        $response->assertForbidden();
    });

    it('allows property owner (host) to create a block', function () {
        $host = User::factory()->create(['role' => 'host']);
        $property = Property::factory()->create(['user_id' => $host->id]);

        $start = now()->addDays(10)->toDateString();
        $end = now()->addDays(15)->toDateString();

        $response = $this->actingAs($host)->postJson("/api/properties/{$property->id}/availability", [
            'blocked_from' => $start,
            'blocked_to' => $end,
            'reason' => 'Annual cleaning',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('blocked_from', $start)
            ->assertJsonPath('blocked_to', $end)
            ->assertJsonPath('reason', 'Annual cleaning')
            ->assertJsonStructure([
                'id',
                'property_id',
                'blocked_from',
                'blocked_to',
                'reason',
                'created_at',
                'updated_at'
            ]);

        $block = AvailabilityBlock::where('property_id', $property->id)->first();
        expect($block)->not->toBeNull()
            ->and($block->blocked_from->toDateString())->toBe($start)
            ->and($block->blocked_to->toDateString())->toBe($end)
            ->and($block->reason)->toBe('Annual cleaning');
    });

    it('fails validation when dates are in the past', function () {
        $host = User::factory()->create(['role' => 'host']);
        $property = Property::factory()->create(['user_id' => $host->id]);

        $response = $this->actingAs($host)->postJson("/api/properties/{$property->id}/availability", [
            'blocked_from' => now()->subDays(5)->toDateString(),
            'blocked_to' => now()->addDays(5)->toDateString(),
            'reason' => 'Backdated block',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['blocked_from']);
    });

    it('fails validation when blocked_to is before or equal to blocked_from', function () {
        $host = User::factory()->create(['role' => 'host']);
        $property = Property::factory()->create(['user_id' => $host->id]);

        $start = now()->addDays(5)->toDateString();

        $response = $this->actingAs($host)->postJson("/api/properties/{$property->id}/availability", [
            'blocked_from' => $start,
            'blocked_to' => $start,
            'reason' => 'Zero day block',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['blocked_to']);
    });

    it('prevents blocking dates that overlap with confirmed bookings', function () {
        $host = User::factory()->create(['role' => 'host']);
        $guest = User::factory()->create(['role' => 'guest']);
        $property = Property::factory()->create(['user_id' => $host->id]);

        // Create a confirmed booking
        Booking::factory()->create([
            'property_id' => $property->id,
            'guest_id' => $guest->id,
            'check_in' => now()->addDays(10)->toDateString(),
            'check_out' => now()->addDays(15)->toDateString(),
            'status' => 'confirmed',
            'guest_count' => 1,
            'price_per_night' => 1000,
            'nights' => 5,
            'subtotal' => 5000,
            'cleaning_fee' => 0,
            'service_fee' => 0,
            'total_amount' => 5000,
        ]);

        // Try to block dates that overlap
        $response = $this->actingAs($host)->postJson("/api/properties/{$property->id}/availability", [
            'blocked_from' => now()->addDays(12)->toDateString(),
            'blocked_to' => now()->addDays(20)->toDateString(),
            'reason' => 'Maintenance overlap',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['blocked_from']);
    });

    it('prevents blocking dates that overlap with pending bookings', function () {
        $host = User::factory()->create(['role' => 'host']);
        $guest = User::factory()->create(['role' => 'guest']);
        $property = Property::factory()->create(['user_id' => $host->id]);

        // Create a pending booking
        Booking::factory()->create([
            'property_id' => $property->id,
            'guest_id' => $guest->id,
            'check_in' => now()->addDays(10)->toDateString(),
            'check_out' => now()->addDays(15)->toDateString(),
            'status' => 'pending',
            'guest_count' => 1,
            'price_per_night' => 1000,
            'nights' => 5,
            'subtotal' => 5000,
            'cleaning_fee' => 0,
            'service_fee' => 0,
            'total_amount' => 5000,
        ]);

        // Try to block dates that overlap
        $response = $this->actingAs($host)->postJson("/api/properties/{$property->id}/availability", [
            'blocked_from' => now()->addDays(12)->toDateString(),
            'blocked_to' => now()->addDays(20)->toDateString(),
            'reason' => 'Maintenance overlap',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['blocked_from']);
    });

    it('allows blocking dates that overlap with cancelled bookings', function () {
        $host = User::factory()->create(['role' => 'host']);
        $guest = User::factory()->create(['role' => 'guest']);
        $property = Property::factory()->create(['user_id' => $host->id]);

        // Create a cancelled booking
        Booking::factory()->create([
            'property_id' => $property->id,
            'guest_id' => $guest->id,
            'check_in' => now()->addDays(10)->toDateString(),
            'check_out' => now()->addDays(15)->toDateString(),
            'status' => 'cancelled',
            'guest_count' => 1,
            'price_per_night' => 1000,
            'nights' => 5,
            'subtotal' => 5000,
            'cleaning_fee' => 0,
            'service_fee' => 0,
            'total_amount' => 5000,
        ]);

        // Try to block dates that overlap
        $start = now()->addDays(12)->toDateString();
        $end = now()->addDays(20)->toDateString();

        $response = $this->actingAs($host)->postJson("/api/properties/{$property->id}/availability", [
            'blocked_from' => $start,
            'blocked_to' => $end,
            'reason' => 'No real overlap',
        ]);

        $response->assertStatus(201);
    });

    it('prevents overlapping availability blocks', function () {
        $host = User::factory()->create(['role' => 'host']);
        $property = Property::factory()->create(['user_id' => $host->id]);

        // Create an existing block
        AvailabilityBlock::create([
            'property_id' => $property->id,
            'blocked_from' => now()->addDays(10)->toDateString(),
            'blocked_to' => now()->addDays(15)->toDateString(),
            'reason' => 'Existing block',
        ]);

        // Try to create an overlapping block
        $response = $this->actingAs($host)->postJson("/api/properties/{$property->id}/availability", [
            'blocked_from' => now()->addDays(14)->toDateString(),
            'blocked_to' => now()->addDays(20)->toDateString(),
            'reason' => 'Overlapping block',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['blocked_from']);
    });

    it('returns 401 when an unauthenticated user tries to delete a block', function () {
        $host = User::factory()->create(['role' => 'host']);
        $property = Property::factory()->create(['user_id' => $host->id]);
        $block = AvailabilityBlock::create([
            'property_id' => $property->id,
            'blocked_from' => now()->addDays(5)->toDateString(),
            'blocked_to' => now()->addDays(10)->toDateString(),
        ]);

        $response = $this->deleteJson("/api/availability/{$block->id}");
        $response->assertUnauthorized();
    });

    it('returns 403 when an unauthorized user tries to delete a block', function () {
        $host = User::factory()->create(['role' => 'host']);
        $otherHost = User::factory()->create(['role' => 'host']);
        $property = Property::factory()->create(['user_id' => $host->id]);
        $block = AvailabilityBlock::create([
            'property_id' => $property->id,
            'blocked_from' => now()->addDays(5)->toDateString(),
            'blocked_to' => now()->addDays(10)->toDateString(),
        ]);

        $response = $this->actingAs($otherHost)->deleteJson("/api/availability/{$block->id}");
        $response->assertForbidden();
    });

    it('allows property owner (host) to delete an availability block', function () {
        $host = User::factory()->create(['role' => 'host']);
        $property = Property::factory()->create(['user_id' => $host->id]);
        $block = AvailabilityBlock::create([
            'property_id' => $property->id,
            'blocked_from' => now()->addDays(5)->toDateString(),
            'blocked_to' => now()->addDays(10)->toDateString(),
        ]);

        $response = $this->actingAs($host)->deleteJson("/api/availability/{$block->id}");
        $response->assertOk()
            ->assertJsonPath('message', 'Availability block deleted.');

        $this->assertDatabaseMissing('availability_blocks', [
            'id' => $block->id,
        ]);
    });
});
