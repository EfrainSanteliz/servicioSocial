<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CoordinatorCareerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('coordinator_career')->insert([
            ['coordinator_id' => 2, 'career_id' => 6],
            ['coordinator_id' => 2, 'career_id' => 8],
            ['coordinator_id' => 3, 'career_id' => 5],
            ['coordinator_id' => 3, 'career_id' => 11],
            ['coordinator_id' => 4, 'career_id' => 7],
            ['coordinator_id' => 4, 'career_id' => 12],
            ['coordinator_id' => 5, 'career_id' => 2],
            ['coordinator_id' => 5, 'career_id' => 4],
            ['coordinator_id' => 6, 'career_id' => 3],
            ['coordinator_id' => 7, 'career_id' => 1],
            ['coordinator_id' => 8, 'career_id' => 10],
            ['coordinator_id' => 9, 'career_id' => 9],
            
        ]);
    }
}
