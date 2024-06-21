<?php

namespace App\Http\Controllers;

use App\Models\Notice;
use App\Models\Career;
use App\Http\Requests\StoreNoticeRequest;
use App\Http\Requests\UpdateNoticeRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class NoticeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request, $career_id)
    {
        try{
            $career = Career::findOrFail($career_id);
            $path = "";

            //Subir el archivo al servidor si se paso un archivo
            if($request -> hasFile('file')){
                $archivo = $request->file('file');

                //Id unico basado en el tiempo de subida del archivo(Esto para evitar sobrescribir archivos del mismo nombre)
                $id = time();

                //Guardar en su propia carpeta
                $dir = 'comunicados/' . $career_id . "/" . $id . "/";

                $nombreArchivo =  $archivo->getClientOriginalName();

                // Crear la carpeta si no existe
                if (!Storage::exists($dir)) {
                    Storage::makeDirectory($dir);
                }

                $archivo->storeAs($dir, $nombreArchivo);
                $path = $id . '/'. $nombreArchivo;

            }

            $notice = new Notice([
                'text' => $request->input('text'),
                'file_path' => $path
            ]);


            $career->notices()->save($notice);

            return response()->json(['success'=>true,'notice'=>$notice]);
        }catch(\Throwable $th){
            return response()->json(['success'=>false,'request'=>$request,'message'=>$th->getMessage()],500);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreNoticeRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreNoticeRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Notice  $notice
     * @return \Illuminate\Http\Response
     */
    public function show($career_id)
    {
        try{
            $carrera = Career::findOrFail($career_id);

            $notices = $carrera -> notices;
            return response()->json(['success'=>true,'notices'=>$notices],200);
        }catch(\Throwable $th){
            return response()->json(['success'=>false,'request'=>$career_id,'message'=>$th->getMessage()],500);
        }

    }

    public function download($notice_id){
        try{
            $notice = Notice::findOrFail($notice_id);

            $file_path = $notice -> file_path;
            $career_id = $notice -> career_id;

            $file_path = 'comunicados/'.$career_id.'/'.$file_path;
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
            return response()->json(['success'=>false,'request'=>$career_id,'message'=>$th->getMessage()],500);
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Notice  $notice
     * @return \Illuminate\Http\Response
     */
    public function edit(Notice $notice)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateNoticeRequest  $request
     * @param  \App\Models\Notice  $notice
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateNoticeRequest $request, Notice $notice)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Notice  $notice
     * @return \Illuminate\Http\Response
     */
    public function destroy($notice_id)
    {
        try {
            $notice = Notice::findOrFail($notice_id);

            // Get file path
            $file_path = 'comunicados/' . $notice->career_id . '/' . $notice->file_path;

            // Check if file exists and delete it
            if (Storage::disk('local')->exists($file_path)) {
                Storage::disk('local')->delete($file_path);
            }

            // Delete the notice
            $notice->delete();

            return response()->json(['success' => true, 'message' => 'Comunicado Eliminado.']);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }
}
