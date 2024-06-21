<?php

namespace Database\Factories;

use App\Models\Admin;
use Illuminate\Database\Eloquent\Factories\Factory;

class AdminFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */

    protected $model = Admin::class;

    public function definition()
    {
        return [
            'name' => $this -> faker -> name,
            'last_name'=> $this -> faker ->lastName,
            'second_last_name'=> $this -> faker ->lastName,
            'email'=> $this -> faker ->email,
            'password'=> bcrypt($this -> faker ->password),
            //'career_id' => Career::inRandomOrder()->first()
        ];
    }
}