<?php

namespace Database\Seeders;

use App\Models\Complaint;
use Illuminate\Database\Seeder;

class ComplaintSeeder extends Seeder
{
    public function run(): void
    {
        Complaint::create([
            'car_repair_id' => 1,
            'description' => 'Service took too long.',
            'status' => 'open',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
