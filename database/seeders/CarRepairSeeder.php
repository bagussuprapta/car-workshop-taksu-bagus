<?php

namespace Database\Seeders;

use App\Models\CarRepair;
use Illuminate\Database\Seeder;

class CarRepairSeeder extends Seeder
{
    public function run(): void
    {
        CarRepair::create([
            'user_id' => 2, // John Doe
            'car_model' => 'Toyota Avanza',
            'date_brought' => now(),
            'status' => 'pending',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
