<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use PhpOffice\PhpSpreadsheet\IOFactory;
use App\Models\Coordinator;
use Illuminate\Support\Facades\DB;

class CoordinatorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //Admin
        Coordinator::factory()->create([
            'no_employed' => 'residencias@hermosillo.tecnm.mx',
            'Name' => 'Lorenia',
            'Last_Name' => 'Acosta',
            'Second_Last_Name' => 'Beltran',
            'password' => bcrypt('Acosta'),
            'department_id' => null,
            'isAdmin' => 1
        ]);

        DB::table('coordinator_career')->insert([
            ['coordinator_id' => 1, 'career_id' => 6],
            ['coordinator_id' => 1, 'career_id' => 8],
            ['coordinator_id' => 1, 'career_id' => 7],
            ['coordinator_id' => 1, 'career_id' => 2],
            ['coordinator_id' => 1, 'career_id' => 4],
            ['coordinator_id' => 1, 'career_id' => 3],
            ['coordinator_id' => 1, 'career_id' => 1],
            ['coordinator_id' => 1, 'career_id' => 10],
            ['coordinator_id' => 1, 'career_id' => 9],
            
        ]);


        $excelFile = storage_path('app/public/coordinadores.xlsx');

        // Cargar el archivo Excel
        $spreadsheet = IOFactory::load($excelFile);
        $sheet = $spreadsheet->getActiveSheet();

        // Obtener todas las filas del archivo Excel
        $data = $sheet->toArray();

        // Omitir la primera fila (títulos)
        array_shift($data);

        // Iterar sobre las filas y seedear la base de datos
        foreach ($data as $row) {
            if($row[0] == null){
                return;
            }
            
            Coordinator::factory()->create([
                'no_employed' => $row[3],
                'Name' => $row[0],
                'Last_Name' => $row[1],
                'Second_Last_Name' => $row[2],
                'password' => bcrypt($row[1]),
                'department_id' => intval($row[4])
            ]);
        }
    }
}
