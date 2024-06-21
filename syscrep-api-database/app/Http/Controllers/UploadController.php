<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Residence;
use App\Models\ExpedienteFile;


class UploadController extends Controller
{
    public function store(Request $request)
    {
        try{
        $request->validate([
            'file' => 'required|file',
            'student_id' => 'required',
            'desired_name' => 'required'
        ]);
        }catch (ValidationException $exception) {
            // La validación ha fallado
            $errors = $exception->errors();
            echo($errors);
            return response()->json(['error' => $errors], 422); // 422 es el código HTTP para "Unprocessable Entity"
        }

        $file = $request->file('file');
        $studentId = $request->input('student_id');
        $desiredName = $request->input('desired_name');
        $filetype = $request->input('filetype');
        $nombreDirectorio = 'Archivos_Alumnos/' . $studentId;

        if ($filetype == "pdf"){
            $nombreArchivo = $desiredName . $studentId . '.pdf'; // Usar el nombre deseado para el archivo
        }else{
            $nombreArchivo = $desiredName . $studentId . '.docx'; // Usar el nombre deseado para el archivo
        }

        
        $path = $nombreDirectorio . '/' . $nombreArchivo;

        if (Storage::exists($path)) {
            Storage::delete($path); // Elimina el archivo existente
        }

        // Crear la carpeta si no existe
        if (!Storage::exists($nombreDirectorio)) {
        Storage::makeDirectory($nombreDirectorio);
        }

        $path = $file->storeAs($nombreDirectorio, $nombreArchivo);

        if ($desiredName == 'Kardex_' || $desiredName == 'Reporte_Preliminar_') {
                        
            $residence = Residence::whereHas('student', function ($query) use ($studentId) {
                $query->where('control_number', $studentId);
            })->first();
    
            if ($residence) {
                // Nombres de archivo
                $kardexFileName = 'Kardex_' . $studentId . '.pdf';
                $prelimReportFileName = 'Reporte_Preliminar_' . $studentId . '.docx';
    
                // Verifica si ambos archivos existen
                if (Storage::exists($nombreDirectorio . '/' . $kardexFileName) &&
                    Storage::exists($nombreDirectorio . '/' . $prelimReportFileName)) {
    
                    $residence->url = $path; // $path es la ruta donde se guardó el archivo.
                    $residence->status = 2; // Cambiar estatus a reporte subido
                    $residence->save();
                }
                
            }

            
            //  no se encuentra la residencia.
        }

        // if($desiredName = "Reporte_Preliminar_Aprobado_Firmado_"){
        //     $ExpedienteFiles = ExpedienteFile::whereHas('student', function ($query) use ($studentId) {
        //         $query->where('control_number', $studentId);
        //     })->first(); 

        //     $ExpedienteFiles ->ReportePreliminarStatus = 1;
        //     $ExpedienteFiles->save();

        // }

        return response()->json(['path' => $path,'student_id' => $studentId]);
    }

    public function show(Request $request, $id){
        try{
        $residence = Residence::whereHas('student', function($query) use ($id) {
            $query->where('control_number', $id);
            })->first();

        if(!$residence){
            return response() -> json(['success'=>false,'message'=>'Residence does not exist'],404);
        }

        $filePath = $residence -> url;

        if (!Storage::disk('local')->exists($filePath)) {
            echo ($filePath);
            abort(404);
        }

        $fileName = pathinfo($filePath)['basename'];

        $headers = [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
        ];
        
        return response()->download(storage_path('app\\'.$filePath),$fileName,$headers);
    } catch (\Throwable $th) {
        echo $th;
        return response() -> json(['success'=>false]);
    }

    }

    public function downloadAceptacion($id){
        try{
            $residence = Residence::whereHas('student', function($query) use ($id) {
                $query->where('control_number', $id);
                })->first();
    
            if(!$residence){
                return response() -> json(['success'=>false,'message'=>'Residence does not exist'],404);
            }
            
            $filePath = 'Archivos_Alumnos/'.$id.'/Solicitud_Residencias'.$id.'.docx';
    
            if (!Storage::disk('local')->exists($filePath)) {
                echo ($filePath);
                abort(404);
            }
    
            $fileName = pathinfo($filePath)['basename'];
            
            ob_end_clean();
            return response()->download(storage_path('app\\'.$filePath),'Solicitud_Residencias'.$id.'.docx');
        } catch (\Throwable $th) {
            echo $th;
            return response() -> json(['success'=>false]);
        }
    }

    public function downloadPresentacion($id){
        try{
            $residence = Residence::whereHas('student', function($query) use ($id) {
                $query->where('control_number', $id);
                })->first();
    
            if(!$residence){
                return response() -> json(['success'=>false,'message'=>'Residence does not exist'],404);
            }
            
            $filePath = 'Archivos_Alumnos/'.$id.'/Carta_Presentacion'.$id.'.docx';
    
            if (!Storage::disk('local')->exists($filePath)) {
                echo ($filePath);
                abort(404);
            }
    
            $fileName = pathinfo($filePath)['basename'];
            
            ob_end_clean();
            return response()->download(storage_path('app\\'.$filePath),'Carta_Presentacion'.$id.'.docx');
        } catch (\Throwable $th) {
            echo $th;
            return response() -> json(['success'=>false]);
        }
    }
}