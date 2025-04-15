<?php

namespace Database\Seeders;

use App\Models\Complaint;
use Illuminate\Database\Seeder;

class ComplaintSeeder extends Seeder
{
    public function run(): void
    {
        Complaint::insert([
            // Open complaints
            [
                'car_repair_id' => 7, // Tesla Model 3
                'description' => 'The alternator repair was not done properly. The car still shows battery warning light after the service.',
                'status' => 'open',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'car_repair_id' => 3, // Ford Mustang
                'description' => 'The engine tune-up seems incomplete. The car is still making unusual noises.',
                'status' => 'open',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // In progress complaints
            [
                'car_repair_id' => 4, // BMW X5
                'description' => 'The brake inspection was not thorough enough. The brakes are still squeaking.',
                'status' => 'in_progress',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Resolved complaints
            [
                'car_repair_id' => 6, // Audi A4
                'description' => 'The spark plug replacement caused engine misfire. The issue has been fixed after rechecking the installation.',
                'status' => 'resolved',
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDays(1),
            ],
            [
                'car_repair_id' => 5, // Mercedes C-Class
                'description' => 'The battery replacement was not properly tested. The car wouldn\'t start the next morning. The issue was resolved with a proper battery installation.',
                'status' => 'resolved',
                'created_at' => now()->subDays(5),
                'updated_at' => now()->subDays(3),
            ],
        ]);
    }
}
