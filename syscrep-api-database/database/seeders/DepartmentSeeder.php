<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use PhpOffice\PhpSpreadsheet\IOFactory;
use App\Models\Department;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $excelFile = storage_path('app/public/departamentos.xlsx');

        // Cargar el archivo Excel
        $spreadsheet = IOFactory::load($excelFile);
        $sheet = $spreadsheet->getActiveSheet();

        // Obtener todas las filas del archivo Excel
        $data = $sheet->toArray();

        // Omitir la primera fila (títulos)
        array_shift($data);

        // Iterar sobre las filas y seedear la base de datos
        foreach ($data as $row) {
            
            Department::create([
                'id' => intval($row[0]),
                'name' => $row[1],
            ]);
        }
    }
}
