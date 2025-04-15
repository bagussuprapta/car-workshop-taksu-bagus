<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::insert([
            [
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'password' => Hash::make('password'),
                'role' => 'car_owner',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Mechanic Mike',
                'email' => 'mike@example.com',
                'password' => Hash::make('password'),
                'role' => 'mechanic',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
