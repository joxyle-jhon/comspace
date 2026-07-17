<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('amenities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('icon')->nullable(); // lucide icon name or emoji
            $table->string('category')->default('general'); // general, safety, kitchen, etc.
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('amenities');
    }
};
