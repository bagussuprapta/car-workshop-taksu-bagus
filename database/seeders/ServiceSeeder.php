<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        Service::insert([
            // Basic Services
            [
                'name' => 'Oil Change',
                'price' => 150000.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Tire Rotation',
                'price' => 100000.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Brake Inspection',
                'price' => 200000.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Engine Services
            [
                'name' => 'Engine Tune-up',
                'price' => 500000.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Spark Plug Replacement',
                'price' => 300000.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Air Filter Replacement',
                'price' => 150000.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Electrical Services
            [
                'name' => 'Battery Check & Replacement',
                'price' => 400000.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Alternator Repair',
                'price' => 600000.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Starter Motor Repair',
                'price' => 550000.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Body & Interior
            [
                'name' => 'Car Wash & Wax',
                'price' => 250000.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Interior Cleaning',
                'price' => 300000.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Paint Touch-up',
                'price' => 450000.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
