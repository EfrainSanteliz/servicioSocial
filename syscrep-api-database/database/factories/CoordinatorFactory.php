<?php

namespace Database\Factories;

use App\Models\Coordinator;
use Illuminate\Database\Eloquent\Factories\Factory;

class CoordinatorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */

    protected $model = Coordinator::class;

    public function definition()
    {
        return [
            'no_employed'=> $this -> faker ->numerify('########'),
            'password'=> bcrypt($this -> faker ->password),
            'company' => $this -> faker -> jobTitle,
            'Actual_state' => 'Active',
            'Name' => $this -> faker -> jobTitle,
            'Last_Name' => $this -> faker -> jobTitle,
            'Second_Last_Name' => $this -> faker -> jobTitle,
            'State' => 0,
            'isAdmin' => 0
        ];
    }
}