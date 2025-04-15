<?php

namespace Database\Seeders;

use App\Models\CarRepair;
use Illuminate\Database\Seeder;

class CarRepairSeeder extends Seeder
{
    public function run(): void
    {
        CarRepair::insert([
            // Pending repairs
            [
                'user_id' => 3, // John Smith
                'car_model' => 'Toyota Camry 2020',
                'date_brought' => now()->subDays(2),
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 4, // Sarah Johnson
                'car_model' => 'Honda Civic 2021',
                'date_brought' => now()->subDays(1),
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // In progress repairs
            [
                'user_id' => 5, // Michael Brown
                'car_model' => 'Ford Mustang 2019',
                'date_brought' => now()->subDays(3),
                'status' => 'in_progress',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 3, // John Smith
                'car_model' => 'BMW X5 2022',
                'date_brought' => now()->subDays(4),
                'status' => 'in_progress',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Waiting for review
            [
                'user_id' => 4, // Sarah Johnson
                'car_model' => 'Mercedes C-Class 2021',
                'date_brought' => now()->subDays(5),
                'status' => 'waiting_for_review',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Completed repairs
            [
                'user_id' => 5, // Michael Brown
                'car_model' => 'Audi A4 2020',
                'date_brought' => now()->subDays(7),
                'status' => 'completed',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 3, // John Smith
                'car_model' => 'Tesla Model 3 2023',
                'date_brought' => now()->subDays(10),
                'status' => 'completed',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
