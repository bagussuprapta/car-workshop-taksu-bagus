<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // mechanic
            $table->foreignId('repair_service_proposal_id')->constrained('repair_service_proposals')->onDelete('cascade');
            $table->enum('status', ['assigned', 'in_progress', 'done']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_assignments');
    }
};
