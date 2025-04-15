<?php

namespace Database\Seeders;

use App\Models\JobAssignment;
use Illuminate\Database\Seeder;

class JobAssignmentSeeder extends Seeder
{
    public function run(): void
    {
        JobAssignment::create([
            'user_id' => 3, // Mechanic Mike
            'repair_service_proposal_id' => 1,
            'status' => 'assigned',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
