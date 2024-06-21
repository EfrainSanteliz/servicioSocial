<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use PhpOffice\PhpSpreadsheet\IOFactory;
use App\Models\Adviser;

class AdviserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $excelFile = storage_path('app/public/asesores.xlsx');

        // Cargar el archivo Excel
        $spreadsheet = IOFactory::load($excelFile);
        $sheet = $spreadsheet->getActiveSheet();

        // Obtener todas las filas del archivo Excel
        $data = $sheet->toArray();

        // Omitir la primera fila (títulos)
        array_shift($data);

        // Iterar sobre las filas y seedear la base de datos
        foreach ($data as $row) {
            
            Adviser::factory()->create([
                'employee_number' => $row[2],
                'name' => $row[1],
                'last_name' => $row[5],
                'second_last_name' => $row[6],
                'department_id' => intval($row[0])
            ]);
        }

    }
}
