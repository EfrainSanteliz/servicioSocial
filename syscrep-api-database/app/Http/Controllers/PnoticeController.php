<?php

namespace App\Http\Controllers;

use App\Models\Pnotice;
use App\Models\Student;
use App\Models\Career;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PnoticeController extends Controller
{
    public function index()
    {
        //
    }


    public function create(Request $request,$student_id)
    {
        echo($request);
        try{
            $student = Student::findOrFail($student_id);
            $path = "";

            //Subir el archivo al servidor si se paso un archivo
            if($request -> hasFile('file')){
                $archivo = $request->file('file');

                //Id unico basado en el tiempo de subida del archivo(Esto para evitar sobrescribir archivos del mismo nombre)
                $id = time();

                //Guardar en su propia carpeta
                $dir = 'pcomunicados/' . $student_id . "/" . $id . "/";

                $nombreArchivo =  $archivo->getClientOriginalName();

                // Crear la carpeta si no existe
                if (!Storage::exists($dir)) {
                    Storage::makeDirectory($dir);
                }

                $archivo->storeAs($dir, $nombreArchivo);
                $path = $id . '/'. $nombreArchivo;

            }

            $pnotice = new Pnotice([
                'ptext' => $request->input('ptext'),
                'file_path' => $path
            ]);


            $student->pnotices()->save($pnotice);

            return response()->json(['success'=>true,'pnotice'=>$pnotice]);
        }catch(\Throwable $th){
            return response()->json(['success'=>false,'request'=>$request,'message'=>$th->getMessage()],500);
        }
    }


    public function store(Request $request)
    {

    }


    public function show($student_id)
    {
        try{
            $student = Student::findOrFail($student_id);

            $pnotices = $student -> pnotices;
            return response()->json(['success'=>true,'pnotices'=>$pnotices],200);
        }catch(\Throwable $th){
            return response()->json(['success'=>false,'request'=>$student,'message'=>$th->getMessage()],500);
        }
    }


    public function download($pnotice_id){
        try{
            $pnotice = Pnotice::findOrFail($pnotice_id);

            $file_path = $pnotice -> file_path;
            $student_id = $pnotice -> student_id;

            $file_path = 'pcomunicados/'.$student_id.'/'.$file_path;
            $fileName = pathinfo($file_path)['basename'];

            if (!Storage::disk('local')->exists($file_path)) {
                return response()->json(['success'=>false,'route'=>$file_path,'message'=>'No se encontro el archivo'],404);
                abort(404);
            }

            $fileContents = Storage::disk('local')->get($file_path);

            ob_end_clean();
            return response($fileContents)
            ->header('Content-Type', Storage::disk('local')->mimeType($file_path))
            ->header('X-Filename', $fileName);

        }catch(\Throwable $th){
            return response()->json(['success'=>false,'request'=>$student_id,'message'=>$th->getMessage()],500);
        }
    }


    public function edit(Pnotice $pnotice)
    {
        //
    }


    public function update(Request $request, Pnotice $pnotice)
    {
        //
    }

    public function destroy($pnotice_id)
    {
        try {
            $pnotice = Pnotice::findOrFail($pnotice_id);

            // Get file path
            $file_path = 'comunicados/' . $pnotice->student_id . '/' . $pnotice->file_path;

            // Check if file exists and delete it
            if (Storage::disk('local')->exists($file_path)) {
                Storage::disk('local')->delete($file_path);
            }

            // Delete the notice
            $pnotice->delete();

            return response()->json(['success' => true, 'message' => 'Comunicado Personal Eliminado.']);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }
}
