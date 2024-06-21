<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Admin;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Admin::factory()->create([
            'email' => 'ejemplo@ith.mx',
            'password' => bcrypt('password')
        ]);

        Admin::factory() -> count(10) -> create();
    }
}
