<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        Service::insert([
            ['name' => 'Oil Change', 'price' => 200000, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Tire Replacement', 'price' => 500000, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
