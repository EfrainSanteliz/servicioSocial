<?php

namespace Database\Seeders;
use App\Models\Student; // Agrega esta línea para importar el modelo Student
use App\Models\ExpedienteFile;


use Illuminate\Database\Seeder;

class ExpedienteFilesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Obtener todos los estudiantes
        $students = Student::all();

        // Iterar sobre cada estudiante y crear un registro en expediente_files para cada uno
        foreach ($students as $student) {
            ExpedienteFile::create([
                'control_number' => $student->control_number,
                'ReportePreliminarStatus' => '0',
                'SolicitudResidenciasStatus' => '0',
                'CartaPresentacionStatus' => '0',
                'CartaAceptacionStatus' => '0',
                'Reporte1Status'=> '0',
                'Reporte2Status'=> '0',
                'Reporte3Status'=> '0',
                'Reporte4Status'=> '0',
    
            ]);
        }
    }
}
