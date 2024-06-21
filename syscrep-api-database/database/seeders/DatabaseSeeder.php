<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(CareerSeeder::class);
        $this->call(DepartmentSeeder::class);
        $this->call(AdminSeeder::class);
        $this->call(CoordinatorSeeder::class);
        $this->call(AdviserSeeder::class);
        $this->call(PeriodSeeder::class);
        $this->call(CompanySeeder::class);
        $this->call(ProyectSeeder::class);
        $this->call(CareerProyectSeeder::class);
        $this->call(StudentSeeder::class);
        $this->call(ReportSeeder::class);
        $this->call(ResidenceSeeder::class);
        $this->call(CoordinatorCareerSeeder::class);

    }
}
