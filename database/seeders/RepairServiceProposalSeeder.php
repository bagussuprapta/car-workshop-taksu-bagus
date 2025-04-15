<?php

namespace Database\Seeders;

use App\Models\RepairServiceProposal;
use Illuminate\Database\Seeder;

class RepairServiceProposalSeeder extends Seeder
{
    public function run(): void
    {
        RepairServiceProposal::create([
            'car_repair_id' => 1,
            'service_id' => 1, // Oil Change
            'status' => 'proposed',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
