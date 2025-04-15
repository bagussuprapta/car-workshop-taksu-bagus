<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        User::truncate();

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        User::insert([
            // Admin users
            [
                'name' => 'Bagus Suprapta',
                'email' => 'superadmin@carworkshop.com',
                'password' => Hash::make('Admin123!'),
                'role' => 'admin',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Ahmad Rizki',
                'email' => 'manager@carworkshop.com',
                'password' => Hash::make('Manager123!'),
                'role' => 'admin',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Car owners
            [
                'name' => 'John Smith',
                'email' => 'john.smith@example.com',
                'password' => Hash::make('CarOwner123!'),
                'role' => 'car_owner',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sarah Johnson',
                'email' => 'sarah.j@example.com',
                'password' => Hash::make('CarOwner123!'),
                'role' => 'car_owner',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Michael Brown',
                'email' => 'm.brown@example.com',
                'password' => Hash::make('CarOwner123!'),
                'role' => 'car_owner',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Mechanics
            [
                'name' => 'David Wilson',
                'email' => 'd.wilson@carworkshop.com',
                'password' => Hash::make('Mechanic123!'),
                'role' => 'mechanic',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Robert Garcia',
                'email' => 'r.garcia@carworkshop.com',
                'password' => Hash::make('Mechanic123!'),
                'role' => 'mechanic',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'James Lee',
                'email' => 'j.lee@carworkshop.com',
                'password' => Hash::make('Mechanic123!'),
                'role' => 'mechanic',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
