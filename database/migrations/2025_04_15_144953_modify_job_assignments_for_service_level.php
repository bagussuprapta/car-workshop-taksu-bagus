<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::dropIfExists('job_assignments');

        Schema::create('job_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('repair_service_proposal_id')
                ->constrained('repair_service_proposals')
                ->onDelete('cascade');
            $table->foreignId('mechanic_id')
                ->constrained('users')
                ->onDelete('cascade');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique('repair_service_proposal_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_assignments');

        Schema::create('job_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('car_repair_id')
                ->constrained()
                ->onDelete('cascade');
            $table->foreignId('mechanic_id')
                ->constrained('users')
                ->onDelete('cascade');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique('car_repair_id');
        });
    }
};
