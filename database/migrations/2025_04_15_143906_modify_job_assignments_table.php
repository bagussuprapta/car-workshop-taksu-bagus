<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('job_assignments', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['repair_service_proposal_id']);
            $table->dropColumn(['user_id', 'repair_service_proposal_id', 'status']);

            $table->foreignId('car_repair_id')->constrained()->onDelete('cascade');
            $table->foreignId('mechanic_id')->constrained('users')->onDelete('cascade');
            $table->text('notes')->nullable();

            $table->unique('car_repair_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_assignments', function (Blueprint $table) {
            $table->dropForeign(['car_repair_id']);
            $table->dropForeign(['mechanic_id']);
            $table->dropColumn(['car_repair_id', 'mechanic_id', 'notes']);

            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('repair_service_proposal_id')->constrained('repair_service_proposals')->onDelete('cascade');
            $table->enum('status', ['assigned', 'in_progress', 'done']);
        });
    }
};
