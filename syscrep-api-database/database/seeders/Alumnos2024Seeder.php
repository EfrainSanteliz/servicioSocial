<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\IOFactory;
use App\Models\Student;
use App\Models\Residence;
use App\Models\ExpedienteFile;

class Alumnos2024Seeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        #Crear nuevo periodo
        $periodId = DB::table('periods')->insertGetId([
            'Año' => 2024,
            'Mitad' => 2,
        ]);

        #Crear estudiantes
        $excelFile = storage_path('app/public/estudiantes_2024.xlsx');

        // Cargar el archivo Excel
        $spreadsheet = IOFactory::load($excelFile);
        $sheet = $spreadsheet->getActiveSheet();

        // Obtener todas las filas del archivo Excel
        $data = $sheet->toArray();
        // Omitir la primera fila (títulos)
        array_shift($data);
        // Iterar sobre las filas y seedear la base de datos
        foreach ($data as $row) {

            $student = 0; //Student ID
            $controlNumber = $row[1];

            $existingStudent = Student::where('control_number', $controlNumber)->first();
            
            if (!$existingStudent){

                $student = Student::factory()->create([
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
            }else{
                $student = $existingStudent;

                $residence = $student->residences()->first();

                if($residence->status >= 6){
                    continue;
                }

                $student->semester = $row[5];
                $student->update();

                //Borrar residencia si existe
                $student->residences()->delete();
                //Borrar expediente si existe
                $student->ExpedienteFile()->delete();
            }

            #Crear nueva residencia
            Residence::factory() -> create([
                'student_id' => $student->id,
                'period_id' => $periodId,
            ]);


            //Abrir nuevo expediente para el proyecto
            ExpedienteFile::create([
                'control_number' => $student->control_number,
                'period_id' => $periodId,
                'ReportePreliminarStatus' => '0',
                'SolicitudResidenciasStatus' => '0',
                'CartaPresentacionStatus' => '0',
                'CartaAceptacionStatus' => '0',
                'Reporte1Status'=> '0',
                'Reporte2Status'=> '0',
                'Reporte3Status'=> '0',
                'Reporte4Status'=> '0',
                'Reporte5Status'=>'0',
                'Reporte6Status'=>'0'
            ]);

        }
    }
}
