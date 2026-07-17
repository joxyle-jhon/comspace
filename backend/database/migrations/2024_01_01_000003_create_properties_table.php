<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // host
            $table->string('title');
            $table->text('description');
            $table->enum('type', ['apartment', 'house', 'villa', 'cabin', 'studio', 'loft', 'condo', 'other'])->default('apartment');
            // Location
            $table->string('address');
            $table->string('city');
            $table->string('state')->nullable();
            $table->string('country');
            $table->string('postal_code')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            // Capacity & rooms
            $table->unsignedTinyInteger('max_guests')->default(1);
            $table->unsignedTinyInteger('bedrooms')->default(1);
            $table->unsignedTinyInteger('beds')->default(1);
            $table->unsignedTinyInteger('bathrooms')->default(1);
            // Pricing (stored in cents to avoid float issues)
            $table->unsignedInteger('price_per_night'); // cents
            $table->unsignedInteger('cleaning_fee')->default(0); // cents
            $table->unsignedInteger('service_fee_percent')->default(14); // percentage
            // Rules
            $table->unsignedTinyInteger('min_nights')->default(1);
            $table->unsignedTinyInteger('max_nights')->default(365);
            $table->boolean('instant_book')->default(false);
            $table->boolean('is_published')->default(false);
            $table->boolean('is_active')->default(true);
            // Stats (denormalized for performance)
            $table->decimal('average_rating', 3, 2)->default(0);
            $table->unsignedInteger('review_count')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['city', 'country']);
            $table->index(['price_per_night']);
            $table->index(['is_published', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
