<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use PhpOffice\PhpSpreadsheet\IOFactory;
use App\Models\Student;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $excelFile = storage_path('app/public/estudiantes.xlsx');

        // Cargar el archivo Excel
        $spreadsheet = IOFactory::load($excelFile);
        $sheet = $spreadsheet->getActiveSheet();

        // Obtener todas las filas del archivo Excel
        $data = $sheet->toArray();

        // Omitir la primera fila (títulos)
        array_shift($data);

        // Iterar sobre las filas y seedear la base de datos
        foreach ($data as $row) {
            
            Student::factory()->create([
                'control_number' => $row[1],
                'name' => $row[4],
                'last_name' => $row[2],
                'second_last_name' => $row[3],
                'nip' => bcrypt($row[7]),
                'semester' => $row[5],
                'email' => $row[6],
                'phone_number' => '555-555-5555',
                'career_id' => intval($row[0])
                
            ]);
        }
    }
}
