<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CareerProyect;

class CareerProyectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        CareerProyect::factory() -> count(20) -> create();
    }
}
