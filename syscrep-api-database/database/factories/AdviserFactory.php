<?php

namespace Database\Factories;

use App\Models\Adviser;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Career;

class AdviserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */

    protected $model = adviser::class;

    public function definition()
    {
        return [
            'name' => $this -> faker -> name,
            'last_name'=> '',
            'second_last_name'=> '',
            'employee_number'=> $this -> faker ->numerify('########'),
            'password'=> bcrypt($this -> faker ->password),
            'email'=>$this -> faker -> email,
            'phone_number'=>$this -> faker -> numerify('###-###-####'),
            'status'=> 0,
            'department_id' => 1
        ];
    }
}
