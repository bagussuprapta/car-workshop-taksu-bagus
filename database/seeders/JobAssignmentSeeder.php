<?php

namespace Database\Seeders;

use App\Models\JobAssignment;
use Illuminate\Database\Seeder;

class JobAssignmentSeeder extends Seeder
{
    public function run(): void
    {
        JobAssignment::insert([
            // Assignments for Toyota Camry
            [
                'repair_service_proposal_id' => 1,
                'mechanic_id' => 6, // David Wilson
                'notes' => 'Regular maintenance service',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Assignments for Honda Civic
            [
                'repair_service_proposal_id' => 2,
                'mechanic_id' => 7, // Robert Garcia
                'notes' => 'Brake system inspection',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Assignments for Ford Mustang
            [
                'repair_service_proposal_id' => 3,
                'mechanic_id' => 8, // James Lee
                'notes' => 'Engine performance check',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Assignments for BMW X5
            [
                'repair_service_proposal_id' => 4,
                'mechanic_id' => 6, // David Wilson
                'notes' => 'Electrical system diagnosis',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Assignments for Mercedes C-Class
            [
                'repair_service_proposal_id' => 5,
                'mechanic_id' => 7, // Robert Garcia
                'notes' => 'Suspension check',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Assignments for Audi A4
            [
                'repair_service_proposal_id' => 6,
                'mechanic_id' => 8, // James Lee
                'notes' => 'Transmission service',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Assignments for Tesla Model 3
            [
                'repair_service_proposal_id' => 7,
                'mechanic_id' => 6, // David Wilson
                'notes' => 'Battery system maintenance',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
