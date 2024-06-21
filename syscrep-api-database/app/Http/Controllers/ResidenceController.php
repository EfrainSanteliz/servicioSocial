<?php

namespace App\Http\Controllers;

use App\Models\Observation;
use App\Models\Residence;
use Illuminate\Http\Request;
use App\Http\Resources\ResidenceResource;
use App\Http\Requests\StoreResidenceRequest;
use App\Http\Requests\UpdateResidenceRequest;
use App\Models\Student;
use App\Models\Adviser;
use App\Models\Coordinator;
use Illuminate\Support\Facades\Storage;



class ResidenceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try{
            //Obtener primero las carreras del asesor y utilizarlas para filtrar los resultados.
            $residences = Residence::with('student','student.career','adviser')->where('status','!=', 0)->get();
            return response()->json(['success'=>true,'data'=>ResidenceResource::collection($residences)]);
        }catch(\Throwable $th){
            echo $th;
            return response()->json(['success'=>false],500);
        }
    }

    public function filter(Request $request){
        try{
            $residencias = [];

            #filtrar por carrera
            if ($request->carreras[0] == 0){
                $residencias = Residence::with('student','student.career','adviser')->where('status','!=', 0)->get();
            }else{
                $residencias = Residence::with('student','student.career','adviser')->whereHas('student', function ($query) use ($request) {
                    $query->whereIn('career_id', $request->carreras);
                })->get();
            }

            return response()->json(['success'=>true,'data'=>ResidenceResource::collection($residencias)]);
        }catch(\Throwable $th){
            return response()->json(['success'=>false], 500);
        }
    }

    #Utilizado para obtener las residencias que se mostraran en la lista del coordinador
    public function list(Request $request){
        try{
            $residencias = [];

            $periodoString = $request->periodo;
            $periodo = explode('-',$periodoString);
            $correo = $request->coordinador;

            $coordinador = Coordinator::with('career')->where('no_employed','=',$correo)->firstOrFail();

            #Obtener carreras del coordinador
            $carreras = $coordinador->career->map(function($carrera){
                return $carrera->id;
            });

            #Residencias sin status 0 del periodo pasado como argumento
            $residencias = Residence::with('student','student.career','adviser','period')->
            where('status','!=',0)
            ->whereHas('period', function($query) use ($periodo){
                $query->where('Año',$periodo[0])
                ->where('mitad',$periodo[1]);
            })->whereHas('student', function($query) use($carreras){
                $query->whereIn('career_id', $carreras);
            })
            ->get();

            #Estudiantes que forman parte de alguna carrera del coordinador

            #Retornar residencias
            return response()->json(['success'=>true,'data'=>ResidenceResource::collection($residencias)], 200);
        }catch(\Throwable $th){
            return response()->json(['success'=>false, 'error'=>$th->getMessage()], 500);
        }
    }

    public function showByControlNumber($controlNumber)
{
    try {
        // Obtenemos la residencia basada en el número de control del estudiante.
        $residence = Residence::with(['student','student.career', 'proyect', 'adviser','proyect.company', 'period'])
                              ->whereHas('student', function($query) use ($controlNumber) {
                                  $query->where('control_number', $controlNumber);
                              })->latest()->first();

        if (!$residence) {
            return response()->json(['success' => false, 'message' => 'Residence not found for the given control number'], 404);
        }

        return new ResidenceResource($residence);

    } catch (\Throwable $th) {
        // De nuevo, te recomendaría registrar el error en lugar de imprimirlo directamente.
        return response()->json(['success' => false], 500);
    }
}





    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreResidenceRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreResidenceRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Residence  $residence
     * @return \Illuminate\Http\Response
     */
    public function show(Residence $residence)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Residence  $residence
     * @return \Illuminate\Http\Response
     */
    public function edit(Request $request, $controlNumber)
    {
        try{
            $residence = Residence::with(['student','student.career', 'proyect', 'adviser','proyect.company'])
            ->whereHas('student', function($query) use ($controlNumber) {
            $query->where('control_number', $controlNumber);
            })->first();

            if(!$residence){
                return response() -> json(['success'=>false,'message'=>'Residence not found'],404);
            }


            // Crear una nueva observación
            $observation = new Observation();
            $observation->observations = $request->observations;
            if($request->exists('file')){
                $observation -> file = $request->file;
            }

            // Asociar la observación a la residencia
            $residence->observations()->save($observation);

            $residence -> observations = $request -> observations;
            $residence -> status = $request -> status;



            if($request->exists('adviser_id')){
                if ($request->adviser_id == 0){
                    $residence -> adviser_id = null;
                }
                $residence -> adviser_id = $request -> adviser_id;
            }

            if($request->exists('proyect_id')){
                if ($request->proyect_id == 0){
                    $residence -> proyect_id = null;
                }
                $residence -> proyect_id = $request -> proyect_id;
            }

//
            $residence -> save();

            return response() -> json(['success'=>true,'data'=>$residence]);
        }catch(\Throwable $th){
            echo $th;
            return response() -> json(['success'=>false],500);
        }
    }

    public function editProyect_id(Request $request, $controlNumber)
    {
        try{
            $residence = Residence::with(['student','student.career', 'proyect', 'adviser','proyect.company'])
            ->whereHas('student', function($query) use ($controlNumber) {
            $query->where('control_number', $controlNumber);
            })->first();


            if($request->exists('proyect_id')){
                if ($request->proyect_id == 0){
                    $residence -> proyect_id = null;
                }
                $residence -> proyect_id = $request -> proyect_id;
            }
            if($request->exists('selectedProyect')){
                if ($request->selectedProyect == 0){
                    $residence -> selectedProyect = null;
                }
                $residence -> selectedProyect = $request -> selectedProyect;
            }



            $residence -> save();

            return response() -> json(['success'=>true,'data'=>$residence]);
        }catch(\Throwable $th){
            echo $th;
            return response() -> json(['success'=>false],500);
        }
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateResidenceRequest  $request
     * @param  \App\Models\Residence  $residence
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateResidenceRequest $request, Residence $residence)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Residence  $residence
     * @return \Illuminate\Http\Response
     */
    public function destroy(Residence $residence)
    {
        //
    }

    public function getStatus($controlNumber)
    {
        $residence = Residence::whereHas('student', function($query) use ($controlNumber) {
            $query->where('control_number', $controlNumber);
            })->first();
        return response()->json(['status' => $residence->status]);
    }

    public function updateStatus(Request $request, $controlNumber)
    {
        $residence = Residence::whereHas('student', function($query) use ($controlNumber) {
            $query->where('control_number', $controlNumber);
            })->first();
        $status = $request->input('status');

        # 0: Default
        # 1: Descargar preliminar
        # 2: Subir preliminar
        # 3: Revisado
        # 4: En Observacion
        # 5: Autorizado

        if (in_array($status, ['0', '1', '2', '3', '4','5','6','7','8'])) {
            $residence->status = $status;
            $residence->save();
            return response()->json(['message' => 'Estado actualizado con éxito']);
        }

        return response()->json(['message' => 'Estado no válido'], 400);
    }

    public function getPreliminar($studentId){
        # Para poder usar esta ruta se debe crear un archivo llamado proyecto_preliminar.pdf en la carpeta storage\app del proyecto de laravel
        $filePath = 'proyecto_preliminar.pdf';

        if (!Storage::disk('local')->exists($filePath)) {
            echo ($filePath);
            abort(404);
        }

        $fileName = pathinfo($filePath)['basename'];

        $headers = [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
        ];

        $residence = Residence::whereHas('student', function($query) use ($studentId) {
            $query->where('control_number', $studentId);
            })->first();

        if($residence -> status == 0) {
            $residence -> status = 1;
            $residence -> save();
        }

        return response()->download(storage_path('app\\'.$filePath),$fileName,$headers);
    }
    public function getPreliminarStudent($studentId){
            // Construyendo el nombre del archivo basado en el studentId
            $fileName = "Reporte_Preliminar_{$studentId}.docx";
            $filePath = "Archivos_Alumnos/{$studentId}/{$fileName}";

            if (!Storage::disk('local')->exists($filePath)) {
                abort(404, 'Archivo no encontrado.');
            }

            $headers = [
                'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
            ];

            // Devuelve la respuesta de descarga
            ob_end_clean();
            return response()->download(storage_path('app/' . $filePath), $fileName, $headers);
    }

    public function getKardexStudent($studentId){



        // Construyendo el nombre del archivo basado en el studentId
        $fileName = "Kardex_{$studentId}.pdf";
        $filePath = "Archivos_Alumnos/{$studentId}/{$fileName}";

        if (!Storage::disk('local')->exists($filePath)) {
            abort(404, 'Archivo no encontrado.');
        }

        $headers = [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
        ];

        // Devuelve la respuesta de descarga
        return response()->download(storage_path('app/' . $filePath), $fileName, $headers);
}

    public function getDocuments(Request $request){
    // Construyendo el nombre del archivo basado en el studentId
    try{
        $request->validate([
            'student_id' => 'required',
            'desired_name' => 'required'
        ]);
        }catch (ValidationException $exception) {
            // La validación ha fallado
            $errors = $exception->errors();
            echo($errors);
            return response()->json(['error' => $errors], 422); // 422 es el código HTTP para "Unprocessable Entity"
        }

        $studentId = $request->input('student_id');
        $desiredName = $request->input('desired_name');
        $filetype = $request->input('filetype');

        if ($filetype == "pdf"){
            $fileName = $desiredName . $studentId . '.pdf'; // Usar el nombre deseado para el archivo
        }else{
            $fileName = $desiredName . $studentId . '.docx'; // Usar el nombre deseado para el archivo
        }

    $filePath = "Archivos_Alumnos/{$studentId}/{$fileName}";

    if (!Storage::disk('local')->exists($filePath)) {
        abort(404, 'Archivo no encontrado.');
    }

    $headers = [
        'Content-Type' => $filetype == 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
        'Cache-Control' => 'no-cache, no-store, must-revalidate', // Prevenir caché
        'Pragma' => 'no-cache', // Prevenir caché para HTTP/1.0
        'Expires' => '0', // Prevenir caché, indicando que el contenido ya expiró
    ];

    // Devuelve la respuesta de descarga
    ob_end_clean();
    return response()->download(storage_path('app/' . $filePath), $fileName, $headers);
}

public function getObservationsStudent($studentId){
    // Construyendo el nombre del archivo basado en el studentId
    $fileName = "Observaciones_{$studentId}.docx";
    $filePath = "Archivos_Alumnos/{$studentId}/{$fileName}";

    if (!Storage::disk('local')->exists($filePath)) {
        abort(404, 'Archivo no encontrado.');
    }

    $headers = [
        'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
    ];

    // Devuelve la respuesta de descarga
    ob_end_clean();
    return response()->download(storage_path('app/' . $filePath), $fileName, $headers);
}

public function getIdentStudent($studentId){
    // Construyendo el nombre del archivo basado en el studentId
    $fileName = "Credencial_{$studentId}.pdf";
    $filePath = "Archivos_Alumnos/{$studentId}/{$fileName}";

    if (!Storage::disk('local')->exists($filePath)) {
        abort(404, 'Archivo no encontrado.');
    }

    $headers = [
        'Content-Type' => 'application/pdf',
        'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
    ];

    // Devuelve la respuesta de descarga
    ob_end_clean();
    return response()->download(storage_path('app/' . $filePath), $fileName, $headers);
}

//Cambia el status de una residencia al anterior
public function revertStatus($controlNumber){
    try{
        $residence = Residence::whereHas('student', function($query) use ($controlNumber) {
            $query->where('control_number', $controlNumber);
            })->first();

        if(!$residence){
            return response()->json(['success'=>false,'error'=>'Residence not found'],404);
        }

        $statusList = array(
            2=>'Entregado',
            3=>'En Asignación de Asesor',
            4=>'Asesor Asignado',
            6=>'Aprobado'
        );

        $newStatus = 0;

        if ($residence -> status < 6){
            $newStatus = $residence -> status - 1;
        }else{
            $newStatus = 4;
        }

        $oldStatus = $statusList[$residence -> status];

        $residence -> status = $newStatus;
        $residence -> adviser_id = null;

        // Crear observacion de cambio de estado.
        $observation = new Observation();
        $observation->observations = 'Estado revertido: ' . $oldStatus . " >> " . $statusList[$newStatus];

        $residence->observations()->save($observation);

        $residence->update();

        return response() -> json(['success'=>true,'residence'=>$residence],200);

    }catch(\Throwable $th){
        return response()->json(['success'=>false,'error'=>$th],400);
    }
}


public function changeAdviser(Request $request, $controlNumber){
    try{
        $residence = Residence::whereHas('student', function($query) use ($controlNumber) {
            $query->where('control_number', $controlNumber);
        })->first();

        $oldAdviser = $residence->adviser_id;

        $oldAdviserName = "Pendiente";
        if($oldAdviser != null){
            $adviser1 = Adviser::find($oldAdviser);
            $oldAdviserName = $adviser1->last_name . " " . $adviser1->second_last_name . " " . $adviser1 -> name;
        }

        $newAdviser = $request->adviser_id;
        $residence->update(['adviser_id' => $newAdviser]);

        $newAdviserName = "Pendiente";

        if($newAdviser != null){
            $adviser = $residence -> adviser;
            $newAdviserName = $adviser->last_name . " " . $adviser->second_last_name . " " . $adviser -> name;
        }

        // Crear observacion de cambio de estado.
        $observation = new Observation();
        $observation->observations = 'Asesor cambiado: ' . $oldAdviserName . " >> " . $newAdviserName;

        $residence->observations()->save($observation);

        return response()->json(['success'=>true,'message'=>$observation->observations],200);

    }catch(\Throwable $th){
        return response()->json(['success'=>false,'error'=>$th],400);
    }
}

}
