<?php

namespace Database\Seeders;

use App\Models\RepairServiceProposal;
use Illuminate\Database\Seeder;

class RepairServiceProposalSeeder extends Seeder
{
    public function run(): void
    {
        RepairServiceProposal::insert([
            // Proposed services
            [
                'car_repair_id' => 1, // Toyota Camry
                'service_id' => 1, // Oil Change
                'status' => 'proposed',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'car_repair_id' => 1, // Toyota Camry
                'service_id' => 3, // Brake Inspection
                'status' => 'proposed',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Approved services
            [
                'car_repair_id' => 3, // Ford Mustang
                'service_id' => 4, // Engine Tune-up
                'status' => 'approved',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'car_repair_id' => 3, // Ford Mustang
                'service_id' => 7, // Battery Check & Replacement
                'status' => 'approved',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Rejected services
            [
                'car_repair_id' => 2, // Honda Civic
                'service_id' => 10, // Car Wash & Wax
                'status' => 'rejected',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Completed services
            [
                'car_repair_id' => 6, // Audi A4
                'service_id' => 2, // Tire Rotation
                'status' => 'completed',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'car_repair_id' => 6, // Audi A4
                'service_id' => 5, // Spark Plug Replacement
                'status' => 'completed',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Services with complaints
            [
                'car_repair_id' => 7, // Tesla Model 3
                'service_id' => 8, // Alternator Repair
                'status' => 'complaint',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
