<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Webhook;
use Stripe\Exception\SignatureVerificationException;

class StripeWebhookController extends Controller
{
    /**
     * Handle incoming Stripe webhook requests.
     */
    public function handle(Request $request): JsonResponse
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $endpointSecret = config('services.stripe.webhook_secret');

        try {
            $event = Webhook::constructEvent(
                $payload,
                $sigHeader,
                $endpointSecret
            );
        } catch (\UnexpectedValueException $e) {
            Log::error('Stripe Webhook Error: Invalid payload', [
                'exception' => $e->getMessage()
            ]);
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'INVALID_PAYLOAD',
                    'message' => 'Invalid payload.'
                ]
            ], 400);
        } catch (SignatureVerificationException $e) {
            Log::error('Stripe Webhook Error: Invalid signature', [
                'exception' => $e->getMessage()
            ]);
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'INVALID_SIGNATURE',
                    'message' => 'Invalid Stripe signature.'
                ]
            ], 400);
        }

        $type = $event->type;
        $dataObject = $event->data->object;

        if ($type === 'payment_intent.succeeded') {
            $paymentIntentId = $dataObject->id;
            $chargeId = $dataObject->latest_charge ?? null;

            $booking = Booking::where('stripe_payment_intent_id', $paymentIntentId)->first();

            if (!$booking) {
                Log::warning("Stripe Webhook: Booking not found for Payment Intent ID: {$paymentIntentId}");
                return response()->json([
                    'success' => false,
                    'error' => [
                        'code' => 'BOOKING_NOT_FOUND',
                        'message' => 'Booking not found for the provided payment intent.'
                    ]
                ], 404);
            }

            $booking->update([
                'status' => 'confirmed',
                'payment_status' => 'paid',
                'stripe_charge_id' => $chargeId,
            ]);
        } elseif ($type === 'payment_intent.payment_failed') {
            $paymentIntentId = $dataObject->id;

            $booking = Booking::where('stripe_payment_intent_id', $paymentIntentId)->first();

            if (!$booking) {
                Log::warning("Stripe Webhook: Booking not found for Payment Intent ID: {$paymentIntentId}");
                return response()->json([
                    'success' => false,
                    'error' => [
                        'code' => 'BOOKING_NOT_FOUND',
                        'message' => 'Booking not found for the provided payment intent.'
                    ]
                ], 404);
            }

            $booking->update([
                'status' => 'cancelled',
                'payment_status' => 'unpaid',
                'cancellation_reason' => 'Payment failed',
                'cancelled_at' => now(),
            ]);
        }

        return response()->json(['success' => true]);
    }
}
