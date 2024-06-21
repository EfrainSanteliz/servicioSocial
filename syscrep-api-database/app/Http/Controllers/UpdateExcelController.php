<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\IOFactory;
use App\Models\Student;
use Illuminate\Support\Facades\Validator;


class UpdateExcelController extends Controller
{
    public function importStudents(Request $request)
    {
    // Especificar la ruta del archivo Excel almacenado en el servidor
    $path = storage_path('app/nuevos_alumnos.xlsx');

    // Verificar si el archivo existe
    if (!file_exists($path)) {
        return response()->json(['error' => 'Archivo no encontrado'], 404);
    }

    // Cargar el archivo Excel
    $spreadsheet = IOFactory::load($path);
    $sheet = $spreadsheet->getActiveSheet();

    // Obtener todas las filas del archivo Excel
    $data = $sheet->toArray();

    // Omitir la primera fila (títulos)
    array_shift($data);

    // Iterar sobre las filas y insertar en la base de datos
    foreach ($data as $row) {
        if($row[0] == null){
            continue;
        }

        $validator = Validator::make([
            'career_id' => $row[0],
            'control_number' => $row[1],
            'semester' => $row[5],
            'email' => $row[6],
            'nip' => $row[7]
        ], [
            'career_id' => 'required|integer',
            'control_number' => 'required|digits_between:8,12',
            'semester' => 'required|integer|max:14',
            'email' => 'required|email',
            'nip' => 'required|digits:4'
        ]);

        if ($validator->fails()) {
            // Manejar el error de validación como prefieras
            continue;
        }

        Student::create([
            'control_number' => $row[1],
            'name' => $row[4],
            'last_name' => $row[2],
            'second_last_name' => $row[3],
            'nip' => bcrypt($row[7]),
            'semester' => $row[5],
            'email' => $row[6],
            'phone_number' => '555-555-5555',
            'career_id' => intval($row[0]),
            'status'=>'0',
            'contents'=>'0'
        ]);
    }

    return response()->json(['success' => 'Importación completada']);
    }
}
