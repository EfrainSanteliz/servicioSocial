<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ReportFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'route' => ($this -> faker -> firstName) . '\\' . ($this -> faker -> lastName),
            'type' => $this -> faker -> numberBetween($min = 1 , $max = 5),
            'observations' => $this -> faker -> realText($maxNbChars = 120)
        ];
    }
}
