<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->restrictOnDelete();
            $table->foreignId('guest_id')->constrained('users')->restrictOnDelete();
            $table->date('check_in');
            $table->date('check_out');
            $table->unsignedTinyInteger('guest_count')->default(1);
            // Pricing snapshot (calculated at booking time, never changes)
            $table->unsignedInteger('nights');
            $table->unsignedInteger('price_per_night'); // cents
            $table->unsignedInteger('subtotal');        // price_per_night * nights, cents
            $table->unsignedInteger('cleaning_fee');    // cents
            $table->unsignedInteger('service_fee');     // cents
            $table->unsignedInteger('total_amount');    // cents
            // Status
            $table->enum('status', [
                'pending',      // awaiting host confirmation
                'confirmed',    // host confirmed / instant book
                'cancelled',    // cancelled by guest or host
                'completed',    // check_out passed
                'refunded',     // after cancellation refund
            ])->default('pending');
            $table->string('cancellation_reason')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            // Stripe
            $table->string('stripe_payment_intent_id')->nullable()->unique();
            $table->string('stripe_charge_id')->nullable();
            $table->enum('payment_status', ['unpaid', 'paid', 'refunded', 'partially_refunded'])->default('unpaid');
            // Guest note
            $table->text('guest_note')->nullable();
            $table->text('host_note')->nullable();
            $table->timestamps();

            // Critical: composite index for overlap detection queries
            $table->index(['property_id', 'check_in', 'check_out', 'status']);
            $table->index(['guest_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
