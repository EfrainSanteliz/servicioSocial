<?php

namespace Database\Factories;

use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Career;
use App\Models\Proyect;

class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */

    protected $model = Student::class;

    public function definition()
    {
        return [
            'name' => $this -> faker -> name,
            'last_name'=> $this -> faker ->lastName,
            'second_last_name'=> $this -> faker ->lastName,
            'control_number'=> $this -> faker ->numerify('########'),
            'nip'=> bcrypt($this -> faker -> numerify('####')),
            'semester'=>$this -> faker -> randomDigit,
            'email'=>$this -> faker -> email,
            'phone_number'=>$this -> faker -> numerify('###-###-####'),
            'status'=>0,
            'contents'=> $this -> faker ->lastName,
            'career_id' => Career::inRandomOrder()->first(),
        ];
    }
}
