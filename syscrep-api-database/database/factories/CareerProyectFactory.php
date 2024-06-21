<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\CareerProyect;
use App\Models\Career;
use App\Models\Proyect;

class CareerProyectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'career_id' => Career::inRandomOrder() -> first(),
            'proyect_id' => Proyect::inRandomOrder() -> first(),
        ];
    }
}
