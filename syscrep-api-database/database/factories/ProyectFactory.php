<?php

namespace Database\Factories;

use App\Models\Proyect;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Company;

class ProyectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */

    protected $model = Proyect::class;

    public function definition()
    {
        return [
          //  'name' => $this->faker->sentence, // O cualquier otro método que desees utilizar
         //   'description' => $this -> faker -> realText($maxNbChars = 120),
         //   'requirements' => $this -> faker -> realText($maxNbChars = 120),
         //   'offer' => $this -> faker -> realText($maxNbChars = 120),
        //    'expiration' => $this -> faker -> date,
        //    'remuneration' => $this -> faker -> numerify('####/hr'),
        //    'resident_number' => $this -> faker -> randomDigitNot(0),
        //    'email' => $this -> faker -> email,
         //   'phone_number' => $this -> faker -> numerify('###-###-####'),
            'company_id' => Company::inRandomOrder()->first()
        ];
    }
}
