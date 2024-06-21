<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use App\Http\Resources\StudentResource;
use App\Http\Requests\{StoreStudentRequest,UpdateStudentRequest};
use App\Models\Residence;
use App\Http\Resources\CareerResource;
use App\Http\Resources\CoordinatorResource;
use App\Http\Resources\StudentInformationResource;
use PhpOffice\PhpWord\TemplateProcessor;
use Illuminate\Support\Facades\Hash;
use App\Models\FormStudent;
use Carbon\Carbon;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\Element\Image;
use PhpOffice\PhpWord\SimpleType\Jc;
use PhpOffice\PhpWord\Style\Image as ImageStyle;
use Illuminate\Support\Facades\Storage;
use App\Models\ExpedienteFile;
use App\Models\Observation;
use Illuminate\Database\Eloquent\ModelNotFoundException;



class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try{
            $student = Student::with('career.coordinators')->get(); //career.coordinators',
            return response()->json(['success'=>true,'data'=>StudentResource::collection($student)]);
        }catch(\Throwable $th){
            return response()->json(['success'=>false],500);
        }

    }

    public function studentInfo(Request $request)
    {
        try{
            $estudiantes = [];
            //Obtener las carreras filtradass
            if ($request->carreras[0] == 0){
                $estudiantes = Student::with('formStudent')->where('status','!=', 0)->get();
            }else{
                $estudiantes = Student::with('formStudent')->whereIn('career_id', $request->carreras)->get();
            }
            
            //Generar recurso de informacion del estudiante
            $information = StudentInformationResource::collection($estudiantes);
            return response()->json(['success'=>true,'data'=>$information]);

            }catch(\Throwable $th){
                return response()->json(['success'=>false,'error'=>$th->getMessage()],500);
            }
    }

    public function changePassword(Request $request, $controlNumber)
    {

        try {

            // Validar el request
            $validatedData = $request->validate([
                'current_password' => 'required',
                'new_password' => 'required|confirmed',
            ]);
    

            $student = Student::where('control_number', $controlNumber)->firstOrFail();
    
            // Verificar que la contraseña actual sea correcta
            if (!Hash::check($request->current_password, $student->nip)) {
                return response()->json(['success' => false, 'message' => 'Current password is incorrect'], 400);
            }
    
            // Actualizar la contraseña
            $student->nip = Hash::make($request->new_password);
            $student->save();
    

            return response()->json(['success' => true, 'message' => 'Password updated successfully']);
    
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }

    }

    

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

   
    public function store(StoreStudentRequest $request)
    {
        try{

            $request->merge(['nip' => Hash::make($request->nip)]);

            $newStudent = Student::create($request -> all());

            $newResidence = Residence::create([
                'student_id' => $newStudent->id,
                'proyect_id' => null,
                'adviser_id' => null,
                'status' => '0',
                'observations' => '',
                'url' => '',
            ]);
    
            // Iniciar sesión del nuevo estudiante y obtener un token
            $token = auth()->login($newStudent);

            return response()->json(['success'=>true,'data'=>new StudentResource($newStudent->load('career','residences')),'token' => $token]);
        }catch(\Throwable $th){
            return response()->json(['success'=>false,'message'=>$th->getMessage()],500);
        }
    }

    public function getStatus($controlNumber)
    {
        $student = Student::where('control_number', $controlNumber)->first();
        return response()->json(['status' => $student->status]);
    }
    
    public function updateStatus(Request $request, $controlNumber)
    {
        $student = Student::where('control_number', $controlNumber)->first();
        $status = $request->input('status');

        # 0: Default
        # 1: Descargar preliminar
        # 2: Subir preliminar
        # 3: Aceptado
        # 4: Rechazado
        # 5: Autorizado
        # 6: Formulario Terminado

        if (in_array($status, ['0', '1', '2', '3', '4', '5', '6'])) {
            $student->status = $status;
            $student->save();
            return response()->json(['message' => 'Estado actualizado con éxito']);
        }

        return response()->json(['message' => 'Estado no válido'], 400);
    }

    public function sendForm($controlNumber){
        try {
            // Buscar el estudiante por número de control
            $student = Student::with('career.coordinators')
                              ->where('control_number', $controlNumber)
                              ->firstOrFail();
        
    
    
            // Preparar los datos requeridos del estudiante
            $studentData = new StudentResource($student);
    
            // Verificar si el estudiante tiene una carrera y si esta tiene coordinadores
            $coordinatorData = [];
            if ($student->career && $student->career->coordinators) {
                foreach ($student->career->coordinators as $coordinator) {
                    $coordinatorData[] = new CoordinatorResource($coordinator);
                }
            }
    
            return response()->json([
                'success' => true,
                'data' => [
                    'student' => $studentData,
                    'coordinators' => $coordinatorData
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => 'Student not found'], 404);
        }
    }

    public function storeForm(Request $request, $controlNumber) {
        // Convertir todos los valores de $request a mayúsculas
        $requestData = array_map('strtoupper', $request->all());
        
        $student = Student::where('control_number', $controlNumber)->firstOrFail();
        $formStudent = $student->formStudent()->create($requestData);
        
        $presentacion = $this->generarCartaDePresentacion($controlNumber);
        $aceptacion = $this->generarHojaMembretada($controlNumber);
    
        if($aceptacion && $presentacion){
            #Actualizar estado de la residencia
            $residence = Residence::whereHas('student', function($query) use ($controlNumber) {
                $query->where('control_number', $controlNumber);
            })->first();
            $residence->status = 7;
            $residence->save();
    
            return response()->json(['success'=>true,'message'=>'Se han generado los documentos']);
        }
        else{
            return response()-> json(['success'=>false],500);
        }
    }

    public function generateFormsForStudentsWithStatusSeven() {
        try {
            // Obtener todos los estudiantes con estado 7
            $students = Student::whereHas('residences', function($query) {
                $query->where('status', '>=', 7);
            })->get();
    
            // Iterar sobre cada estudiante y generar los formularios
            foreach ($students as $student) {
                $controlNumber = $student->control_number;
                
                // Generar los formularios para el estudiante
                $presentacion = $this->generarCartaDePresentacion($controlNumber);
                $aceptacion = $this->generarHojaMembretada($controlNumber);
    
                // Verificar si se generaron los formularios correctamente
                if ($aceptacion && $presentacion) {

                } else {
                    // Si ocurre un error al generar los formularios para un estudiante, continuar con el siguiente
                    continue;
                }
            }
    
            return response()->json(['success' => true, 'message' => 'Se han generado los docuemtnos para todos los estudiantes con estado 7']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Ha ocurrido un error al generar los docuemtnos: ' . $e->getMessage()], 500);
        }
    }

    public function saveOrUpdateFormProgress(Request $request, $controlNumber)
    {
    try {
        // Buscar un formulario existente o crear uno nuevo
        $formStudent = FormStudent::firstOrNew(['control_number' => $controlNumber]);

        

        // Actualizar los datos del formulario con la información proporcionada
        $formStudent->fill($request->only([
            'calleyNum',
            'colonia',
            'ciudad',
            'telefonoCelular',
            'telefonoCasa',
            'nss',
            'genero',
            'correoInstitucional',
            'correoPersonal',
            'razonSocial',
            'nombreEmpresa',
            'rfcEmpresa',
            'misionEmpresa',
            'direccionEmpresa',
            'coloniaEmpresa',
            'telefonoEmpresa',
            'correoEmpresa',
            'ciudadEmpresa',
            'cpEmpresa',
            'tituloPersonatitular',
            'nombrePersonatitular',
            'cargoPersonatitular',
            'responsableResidencias',
            'cargoResponsableResidencias',
            'tamañoEmpresa',
            'sectorEmpresa',
            'giroEmpresa',
            'EsInstitucionAcademica',
            'EsEmpresaSinFinesDeLucro',
            'Industria',
            'OrigenProyecto',
            'nombreProyecto',
            'numeroEstudiantes',
            'fechaInicio',
            'fechaFin',
            'nombreAsesorInterno',
            'nombreAsesorExterno',
            'puestoAsesorExterno',
            'correoAsesorExterno',
            'numeroAsesorExterno',
            'AsesorExternoEgresadoITH',
        ]));

        // Guardar el progreso del formulario
        $formStudent->save();

        return response()->json(['success' => true, 'message' => 'Form progress saved successfully']);
    } catch (\Exception $e) {
        // Manejar cualquier excepción
        return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
    }
    }   

    public function updateForm(Request $request, $controlNumber) {
        try {
            
            $student = Student::where('control_number', $controlNumber)->firstOrFail();
            $formStudent = $student->formStudent;
    
            if (!$formStudent) {
                return response()->json(['success' => false, 'message' => 'Form not found'], 404);
            }
            $formStudent->update($request->all());
        
            return response()->json(['success' => true, 'message' => 'Form updated successfully']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }



    

    public function showForm($controlNumber) {
        try {
            $student = Student::where('control_number', $controlNumber)->firstOrFail();
            $formStudent = $student->formStudent;
    
            if ($formStudent) {
                return response()->json(['success' => true, 'data' => $formStudent]);
            } else {
                return response()->json(['success' => false, 'message' => 'No se encontró el formulario asociado al estudiante.'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Error al procesar la solicitud.'], 500);
        }
    }

    public function deleteForm($controlNumber) {
        try {
            $student = Student::where('control_number', $controlNumber)->firstOrFail();
    
            // Eliminar formulario del estudiante
            $student->formStudent()->delete();
    
            return response()->json(['success' => true, 'message' => 'Se ha eliminado el formulario y documentos asociados']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Error al eliminar el formulario'], 500);
        }
    }

    public function generarCartaDePresentacion($controlNumber)
    {
        try{
        \PhpOffice\PhpWord\Settings::setOutputEscapingEnabled(true);


        $student = Student::with('formStudent','career')->where('control_number', $controlNumber)->firstOrFail();

        if (!$student->formStudent) {
            // Manejar el caso en que no existan datos del formulario
            return response()->json(['message' => 'No se encontraron datos del formulario para este estudiante'], 404);
        }

        $templatePath = storage_path('app/Solicutud_de_residencias_profesionales_2024 ITH.docx');
        $templateProcessor = new TemplateProcessor($templatePath);

        Carbon::setLocale('es');
        // Formatear la fecha actual al español
        $fecha_actual = Carbon::now()->translatedFormat('d \D\E F \D\E Y');

        // Filtrar el primer coordinador cuyo id no sea 1
        $coordinator = $student->career->coordinators->first(function ($coordinator) {
            return $coordinator->id !== 1;
        });
        $coordinatorName = $coordinator ? "{$coordinator->Name} {$coordinator->Last_Name} {$coordinator->Second_Last_Name}" : "Coordinador no asignado";



        // Reemplazar los marcadores de posición con los datos del estudiante
        $templateProcessor->setValue('coordinator', mb_strtoupper($coordinatorName,'UTF-8'));
        $templateProcessor->setValue('name', mb_strtoupper($student->name,'UTF-8'));
        $templateProcessor->setValue('last_name', mb_strtoupper($student->last_name,'UTF-8'));
        $templateProcessor->setValue('second_last_name', mb_strtoupper($student->second_last_name,'UTF-8'));
        $templateProcessor->setValue('control_number', mb_strtoupper($student->control_number,'UTF-8'));
        $templateProcessor->setValue('calleyNum', mb_strtoupper($student->formStudent->calleyNum,'UTF-8'));
        $templateProcessor->setValue('colonia', mb_strtoupper($student->formStudent->colonia,'UTF-8'));
        $templateProcessor->setValue('email', mb_strtoupper($student->email,'UTF-8'));
        $templateProcessor->setValue('ciudad', mb_strtoupper($student->formStudent->ciudad,'UTF-8'));
        $templateProcessor->setValue('nss', mb_strtoupper($student->formStudent->nss,'UTF-8'));
        $templateProcessor->setValue('telefonoCasa', mb_strtoupper($student->formStudent->telefonoCasa,'UTF-8'));
        $templateProcessor->setValue('telefonoCelular', mb_strtoupper($student->formStudent->telefonoCelular,'UTF-8'));
        $templateProcessor->setValue('carrera', mb_strtoupper($student->career->name,'UTF-8'));
        $templateProcessor->setValue('nombreProyecto', mb_strtoupper($student->formStudent->nombreProyecto,'UTF-8'));
        $templateProcessor->setValue('OrigenProyecto', mb_strtoupper($student->formStudent->OrigenProyecto,'UTF-8'));
        $templateProcessor->setValue('fechaInicio', mb_strtoupper($student->formStudent->fechaInicio,'UTF-8'));
        $templateProcessor->setValue('fechaFin', mb_strtoupper($student->formStudent->fechaFin,'UTF-8'));
        $templateProcessor->setValue('numeroEstudiantes', mb_strtoupper($student->formStudent->numeroEstudiantes,'UTF-8'));
        $templateProcessor->setValue('nombreEmpresa', mb_strtoupper($student->formStudent->nombreEmpresa,'UTF-8'));
        $templateProcessor->setValue('giroEmpresa', mb_strtoupper($student->formStudent->giroEmpresa,'UTF-8'));
        $templateProcessor->setValue('sectorEmpresa', mb_strtoupper($student->formStudent->sectorEmpresa,'UTF-8'));
        $templateProcessor->setValue('rfcEmpresa', mb_strtoupper($student->formStudent->rfcEmpresa,'UTF-8'));
        $templateProcessor->setValue('direccionEmpresa', mb_strtoupper($student->formStudent->direccionEmpresa,'UTF-8'));
        $templateProcessor->setValue('coloniaEmpresa', mb_strtoupper($student->formStudent->coloniaEmpresa,'UTF-8'));
        $templateProcessor->setValue('cpEmpresa', mb_strtoupper($student->formStudent->cpEmpresa,'UTF-8'));
        $templateProcessor->setValue('correoEmpresa', mb_strtoupper($student->formStudent->correoEmpresa,'UTF-8'));
        $templateProcessor->setValue('ciudadEmpresa', mb_strtoupper($student->formStudent->ciudadEmpresa,'UTF-8'));
        $templateProcessor->setValue('telefonoEmpresa', mb_strtoupper($student->formStudent->telefonoEmpresa,'UTF-8'));
        $templateProcessor->setValue('misionEmpresa', mb_strtoupper($student->formStudent->misionEmpresa,'UTF-8'));
        $templateProcessor->setValue('nombrePersonatitular', mb_strtoupper($student->formStudent->nombrePersonatitular,'UTF-8'));
        $templateProcessor->setValue('tituloPersonatitular', mb_strtoupper($student->formStudent->tituloPersonatitular,'UTF-8'));
        $templateProcessor->setValue('nombreAsesorExterno', mb_strtoupper($student->formStudent->nombreAsesorExterno,'UTF-8'));
        $templateProcessor->setValue('puestoAsesorExterno', mb_strtoupper($student->formStudent->puestoAsesorExterno,'UTF-8'));
        $templateProcessor->setValue('correoAsesorExterno', mb_strtoupper($student->formStudent->correoAsesorExterno));
        $templateProcessor->setValue('numeroAsesorExterno', mb_strtoupper($student->formStudent->numeroAsesorExterno));
        $templateProcessor->setValue('responsableResidencias', mb_strtoupper($student->formStudent->responsableResidencias,'UTF-8'));
        $templateProcessor->setValue('cargoResponsableResidencias', mb_strtoupper($student->formStudent->cargoResponsableResidencias,'UTF-8'));
        $templateProcessor->setValue('fecha_actual', mb_strtoupper($fecha_actual,'UTF-8'));



        $newFilePath = storage_path('app/Archivos_Alumnos/'.$controlNumber.'/Solicitud_Residencias' . $controlNumber . '.docx');
        if (file_exists($newFilePath)) {
            // Opción 1: Eliminar el archivo existente antes de guardar el nuevo
            unlink($newFilePath);

            // Opción 2: Puedes renombrar el archivo existente antes de guardar el nuevo
            // rename($newFilePath, $newFilePath . '_backup_' . time());
        }
        $templateProcessor->saveAs($newFilePath);

        return true;
    }catch (\Throwable $th) {
            return false;
        }
    }

    public function generarHojaMembretada($controlNumber)
    {
        try{
        \PhpOffice\PhpWord\Settings::setOutputEscapingEnabled(true);

        $student = Student::with('formStudent','career')->where('control_number', $controlNumber)->firstOrFail();

        if (!$student->formStudent) {
            // Manejar el caso en que no existan datos del formulario
            return response()->json(['message' => 'No se encontraron datos del formulario para este estudiante'], 404);
        }

        // Establecer el locale en español
        Carbon::setLocale('es');

        $fechaInicio = Carbon::parse($student->formStudent->fechaInicio)->translatedFormat('d \D\E F \D\E Y');
        $fechaFin = Carbon::parse($student->formStudent->fechaFin)->translatedFormat('d \D\E F \D\E Y');

        $fecha_actual = Carbon::now()->translatedFormat('d \D\E F \D\E Y');

        


        $templatePath = storage_path('app/Hoja_membretada_2024 ITH CP.docx');
        $templateProcessor = new TemplateProcessor($templatePath);

        // Reemplazar los marcadores de posición con los datos del estudiante
        // Reemplazar los marcadores de posición con los datos del estudiante
        $templateProcessor->setValue('name', mb_strtoupper($student->name,'UTF-8'));
        $templateProcessor->setValue('last_name', mb_strtoupper($student->last_name,'UTF-8'));
        $templateProcessor->setValue('second_last_name', mb_strtoupper($student->second_last_name,'UTF-8'));
        $templateProcessor->setValue('control_number', mb_strtoupper($student->control_number,'UTF-8'));
        $templateProcessor->setValue('carrera', mb_strtoupper($student->career->name,'UTF-8'));
        $templateProcessor->setValue('nombreProyecto', (mb_strtoupper($student->formStudent->nombreProyecto, 'UTF-8')));
        $templateProcessor->setValue('fechaInicio', mb_strtoupper($fechaInicio,'UTF-8'));
        $templateProcessor->setValue('fechaFin', mb_strtoupper($fechaFin,'UTF-8'));
        $templateProcessor->setValue('nss', mb_strtoupper($student->formStudent->nss,'UTF-8'));
        $templateProcessor->setValue('nombreEmpresa',( mb_strtoupper($student->formStudent->nombreEmpresa,'UTF-8')));
        $templateProcessor->setValue('nombrePersonatitular',( mb_strtoupper($student->formStudent->nombrePersonatitular,'UTF-8')));
        $templateProcessor->setValue('tituloPersonatitular',( mb_strtoupper($student->formStudent->tituloPersonatitular,'UTF-8')));
        $templateProcessor->setValue('fecha_actual', mb_strtoupper($fecha_actual,'UTF-8'));
        $templateProcessor->setValue('id', mb_strtoupper($student->id,'UTF-8'));
        $templateProcessor->setValue('cargoPersonatitular', (mb_strtoupper($student->formStudent->cargoPersonatitular,'UTF-8')));


        



        $newFilePath = storage_path('app/Archivos_Alumnos/'.$controlNumber.'/Carta_Presentacion' . $controlNumber . '.docx');
        if (file_exists($newFilePath)) {
            // Opción 1: Eliminar el archivo existente antes de guardar el nuevo
            unlink($newFilePath);

            // Opción 2: Puedes renombrar el archivo existente antes de guardar el nuevo
            // rename($newFilePath, $newFilePath . '_backup_' . time());
        }
        $templateProcessor->saveAs($newFilePath);

        return true;
    }catch (\Throwable $th) {
        return false;
    }
    }



    public function remplazarHojaMembretada($controlNumber)
    {
        // Ruta del archivo antiguo
        $rutaAntigua = storage_path('app/Archivos_Alumnos/'.$controlNumber.'/Carta_Presentacion' . $controlNumber . '.docx');

        // Ruta del archivo nuevo (puedes modificarla según tus necesidades)
        $rutaNueva = storage_path('app/Archivos_Alumnos/'.$controlNumber.'/Carta_Presentacion' . $controlNumber . '.docx');

        // Reemplazar el archivo
        if (Storage::exists($rutaAntigua)) {
            Storage::move($rutaAntigua, $rutaNueva);
            return response()->json(['message' => 'Archivo reemplazado correctamente'], 200);
        } else {
            return response()->json(['error' => 'El archivo antiguo no existe'], 404);
        }
    }

    


    /**
     * Display the specified resource.
     *
     * @param  \App\Student  $student
     * @return \Illuminate\Http\Response
     */
    public function show(Student $students)
    {
        try{

            return response()->json(['success'=>true,'data'=>new StudentResource($students->load('career'))]);
        }catch(\Throwable $th){
            return response()->json(['success'=>false], 500);
        }
    }

    public function showid($id)
    {
        try {
            $students = Student::with(['career', 'residences'])->findOrFail($id);

            // Puedes personalizar los datos que deseas enviar en la respuesta aquí
            return response()->json(['success' => true, 'data' => $students]);
            
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => 'Internal Server Error'], 500);
        }
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Student  $student
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateStudentRequest $request, Student $student)
    {
    try {
        // Actualizar el estudiante con los datos del request
        $student->update($request->all());

        // Devolver una respuesta con el estudiante actualizado
        return response()->json(['success'=>true, 'data'=>new StudentResource($student->load('career'))]);
    } catch (\Throwable $th) {
        // En caso de error, devolver una respuesta con mensaje de error
        return response()->json(['success'=>false, 'message' => $th->getMessage()], 500);
    }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Student  $student
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
    try {
        $student = Student::find($id);
        if (!$student) {
            return response()->json(['success' => false, 'message' => 'Student not found'], 404);
        }

        $student->delete();
        return response()->json(['success' => true, 'message' => 'Student deleted successfully']);
    } catch (\Throwable $th) {
        return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
    }
    }
    
    public function updateStatusExpediente($controlNumber, Request $request)
{
    // Validación de la solicitud
    $request->validate([
        'statusKey' => 'required|string', // nombre del estado a actualizar
        'statusValue' => 'required|string', // valor para el estado
    ]);

    try {
        // Intentar obtener el expediente por número de control
        $expedienteFile = ExpedienteFile::where('control_number', $controlNumber)->firstOrFail();

        // Actualizar el estado especificado
        $statusKey = $request->statusKey;
        if (in_array($statusKey, ['ReportePreliminarStatus', 'SolicitudResidenciasStatus', 'CartaPresentacionStatus', 'CartaAceptacionStatus','Reporte1Status', 'Reporte2Status','Reporte3Status','Reporte4Status','Reporte5Status','Reporte6Status'])) {
            $expedienteFile->$statusKey = $request->statusValue;
            $expedienteFile->save();

            //Si el estatus es 2 guardar observaciones
            if($request->statusValue == "2"){
                $observation = new Observation();

                $observation->observations = $request->observations;
                $observation -> file = $request->file;

                $residence = Residence::whereHas('student', function($query) use ($controlNumber) {
                    $query->where('control_number', $controlNumber);
                })->first();
                
                $residence->observations()->save($observation);
            }

            return response()->json(['message' => 'Estado actualizado correctamente.'], 200);
        } else {
            // La clave del estado proporcionada no es válida
            return response()->json(['message' => 'La clave del estado no es válida.'], 400);
        }
    } catch (ModelNotFoundException $e) {
        // Manejar el caso en que no se encuentra el expediente
        return response()->json(['message' => 'Número de control no encontrado.'], 404);
    } catch (\Exception $e) {
        // Manejar cualquier otro error que pueda ocurrir
        return response()->json(['message' => 'Error al actualizar el estado.', 'error' => $e->getMessage()], 500);
    }
}
public function getStatusExpediente(Request $request, $control_number)
{
    $expediente = ExpedienteFile::where('control_number', $control_number)->first();

    if (!$expediente) {
        return response()->json(['message' => 'Expediente no encontrado'], 404);
    }

    $status = [
        'ReportePreliminarStatus' => $expediente->ReportePreliminarStatus,
        'SolicitudResidenciasStatus' => $expediente->SolicitudResidenciasStatus,
        'CartaPresentacionStatus' => $expediente->CartaPresentacionStatus,
        'CartaAceptacionStatus' => $expediente->CartaAceptacionStatus,
        'Reporte1Status'=> $expediente->Reporte1Status,
        'Reporte2Status'=> $expediente->Reporte2Status,
        'Reporte3Status'=> $expediente->Reporte3Status,
        'Reporte4Status'=> $expediente->Reporte4Status,
        'Reporte5Status'=> $expediente->Reporte5Status,
        'Reporte6Status'=> $expediente->Reporte6Status
    ];

    return response()->json($status);
}

}
