<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Student;
use App\Models\Proyect;
use App\Models\Adviser;

class ResidenceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'student_id' => 1,
            'proyect_id' => null,
            'adviser_id' => null,
            'status' => '0',
            'observations' => '',
            'url' => "",
        ];
    }
}
