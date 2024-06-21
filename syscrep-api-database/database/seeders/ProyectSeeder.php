<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Proyect;

class ProyectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Proyect::factory() -> count(10) -> create();
    }
}
