<?php

use App\Models\Booking;

beforeEach(function () {
    config(['services.stripe.webhook_secret' => 'whsec_test_secret']);
});

function generateStripeSignature(string $payload, string $secret): string
{
    $timestamp = time();
    $signedPayload = $timestamp . '.' . $payload;
    $signature = hash_hmac('sha256', $signedPayload, $secret);
    return "t={$timestamp},v1={$signature}";
}

describe('Stripe Webhook API', function () {

    it('fails when signature header is missing', function () {
        $response = $this->postJson('/api/webhooks/stripe', [
            'id' => 'evt_test_123',
            'type' => 'payment_intent.succeeded',
        ]);

        $response->assertStatus(400)
            ->assertJsonPath('success', false)
            ->assertJsonPath('error.code', 'INVALID_SIGNATURE');
    });

    it('fails when signature is invalid', function () {
        $payload = json_encode([
            'id' => 'evt_test_123',
            'type' => 'payment_intent.succeeded',
        ]);

        $response = $this->withHeaders([
            'Stripe-Signature' => 't=123,v1=invalid_signature_hash',
        ])->postJson('/api/webhooks/stripe', json_decode($payload, true));

        $response->assertStatus(400)
            ->assertJsonPath('success', false)
            ->assertJsonPath('error.code', 'INVALID_SIGNATURE');
    });

    it('processes payment_intent.succeeded and marks booking as confirmed and paid', function () {
        $booking = Booking::factory()->create([
            'stripe_payment_intent_id' => 'pi_success_123',
            'status' => 'pending',
            'payment_status' => 'unpaid',
        ]);

        $eventPayload = [
            'id' => 'evt_success_123',
            'type' => 'payment_intent.succeeded',
            'data' => [
                'object' => [
                    'id' => 'pi_success_123',
                    'latest_charge' => 'ch_charge_123',
                    'status' => 'succeeded',
                ],
            ],
        ];

        $payloadJson = json_encode($eventPayload);
        $signature = generateStripeSignature($payloadJson, 'whsec_test_secret');

        $response = $this->withHeaders([
            'Stripe-Signature' => $signature,
        ])->postJson('/api/webhooks/stripe', $eventPayload);

        $response->assertOk()
            ->assertJsonPath('success', true);

        $booking->refresh();
        expect($booking->status)->toBe('confirmed');
        expect($booking->payment_status)->toBe('paid');
        expect($booking->stripe_charge_id)->toBe('ch_charge_123');
    });

    it('processes payment_intent.payment_failed and cancels booking', function () {
        $booking = Booking::factory()->create([
            'stripe_payment_intent_id' => 'pi_failed_123',
            'status' => 'pending',
            'payment_status' => 'unpaid',
        ]);

        $eventPayload = [
            'id' => 'evt_failed_123',
            'type' => 'payment_intent.payment_failed',
            'data' => [
                'object' => [
                    'id' => 'pi_failed_123',
                    'status' => 'requires_payment_method',
                ],
            ],
        ];

        $payloadJson = json_encode($eventPayload);
        $signature = generateStripeSignature($payloadJson, 'whsec_test_secret');

        $response = $this->withHeaders([
            'Stripe-Signature' => $signature,
        ])->postJson('/api/webhooks/stripe', $eventPayload);

        $response->assertOk()
            ->assertJsonPath('success', true);

        $booking->refresh();
        expect($booking->status)->toBe('cancelled');
        expect($booking->payment_status)->toBe('unpaid');
        expect($booking->cancellation_reason)->toBe('Payment failed');
        expect($booking->cancelled_at)->not->toBeNull();
    });

    it('returns 404 if booking is not found for payment intent', function () {
        $eventPayload = [
            'id' => 'evt_not_found_123',
            'type' => 'payment_intent.succeeded',
            'data' => [
                'object' => [
                    'id' => 'pi_nonexistent_123',
                    'latest_charge' => 'ch_charge_123',
                    'status' => 'succeeded',
                ],
            ],
        ];

        $payloadJson = json_encode($eventPayload);
        $signature = generateStripeSignature($payloadJson, 'whsec_test_secret');

        $response = $this->withHeaders([
            'Stripe-Signature' => $signature,
        ])->postJson('/api/webhooks/stripe', $eventPayload);

        $response->assertStatus(404)
            ->assertJsonPath('success', false)
            ->assertJsonPath('error.code', 'BOOKING_NOT_FOUND');
    });

    it('ignores other Stripe events and returns 200', function () {
        $eventPayload = [
            'id' => 'evt_ignored_123',
            'type' => 'payment_intent.created',
            'data' => [
                'object' => [
                    'id' => 'pi_created_123',
                    'status' => 'requires_payment_method',
                ],
            ],
        ];

        $payloadJson = json_encode($eventPayload);
        $signature = generateStripeSignature($payloadJson, 'whsec_test_secret');

        $response = $this->withHeaders([
            'Stripe-Signature' => $signature,
        ])->postJson('/api/webhooks/stripe', $eventPayload);

        $response->assertOk()
            ->assertJsonPath('success', true);
    });
});
