<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Residence;
use App\Models\Student;

class ResidenceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Student::all()->each(function($estudiante){
            Residence::factory() -> create([
                'student_id' => $estudiante->id
            ]);
        });
    }
}
