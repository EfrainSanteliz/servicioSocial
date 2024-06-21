<?php

namespace Database\Factories;

use App\Models\Company;
use Illuminate\Database\Eloquent\Factories\Factory;

class CompanyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        //$types=['publica','privada'];

        return [
          //  'name' => $this -> faker -> company,
           // 'address' => $this -> faker -> realText($maxNbChars = 120),
          //  'phone_number' => $this -> faker -> numerify('###-###-####'),
          //  'email' => $this -> faker -> email,
           // 'in_charge' => $this -> faker -> company,
           // 'type' => $this -> faker -> randomElement($types),

        ];
    }
}
