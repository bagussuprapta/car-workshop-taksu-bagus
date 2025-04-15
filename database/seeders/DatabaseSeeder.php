<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Service;
use App\Models\CarRepair;
use App\Models\RepairServiceProposal;
use App\Models\JobAssignment;
use App\Models\Complaint;
use Illuminate\Support\Facades\DB;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        Complaint::truncate();
        JobAssignment::truncate();
        RepairServiceProposal::truncate();
        CarRepair::truncate();
        Service::truncate();
        User::truncate();

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $this->call([
            UserSeeder::class,
            ServiceSeeder::class,
            CarRepairSeeder::class,
            RepairServiceProposalSeeder::class,
            JobAssignmentSeeder::class,
            ComplaintSeeder::class,
        ]);

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}
