<?php

namespace App\Http\Controllers;

use App\Models\Coordinator;
use App\Http\Requests\StoreCoordinatorRequest;
use App\Http\Requests\UpdateCoordinatorRequest;
use App\Http\Resources\CoordinatorResource;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Career;
use Illuminate\Support\Facades\Hash;


class CoordinatorController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
    try {
        $coordinators = Coordinator::with(['career','department'])->get();
        return response()->json(['success' => true, 'data' => CoordinatorResource::collection($coordinators)]);
    } catch (\Throwable $th) {
        return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
    }
    }

    

    /**
     * Show the form for creating a new resource.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    public function assignCareerToCoordinator(Request $request)
    {
        // si el usuario no es admin no puede asignar carrera a cordinadores
        // if (auth()->user()->isAdmin !== 1) {
        //     return response()->json(['error' => 'Acceso denegado. Solo los administradores pueden realizar esta operación.'], Response::HTTP_FORBIDDEN);
        // }

        $coordinatorId = $request->input('coordinator_id');
        $careerId = $request->input('career_id');

        $coordinator = Coordinator::findOrFail($coordinatorId);
        $career = Career::findOrFail($careerId);

        // Asignar la carrera al coordinador
        $coordinator->career()->syncWithoutDetaching([$careerId]);

        return response()->json(['message' => 'La carrera ha sido asignada correctamente al coordinador.']);
    }

    public function moveCoordinatorToAnotherCareer(Request $request)
    {   
    // if (auth()->user()->isAdmin !== 1) {
    //     return response()->json(['error' => 'Acceso denegado. Solo los administradores pueden realizar esta operación.'], Response::HTTP_FORBIDDEN);
    // }

    $coordinatorId = $request->input('coordinator_id');
    $oldCareerId = $request->input('old_career_id');
    $newCareerId = $request->input('new_career_id');

    $coordinator = Coordinator::findOrFail($coordinatorId);
    
    // Asegurarse de que la carrera antigua y la nueva existen
    $oldCareer = Career::findOrFail($oldCareerId);
    $newCareer = Career::findOrFail($newCareerId);

    // Remover la carrera antigua y asignar la nueva
    $coordinator->careers()->detach($oldCareerId);
    $coordinator->careers()->syncWithoutDetaching([$newCareerId]);

    return response()->json(['message' => 'El coordinador ha sido movido a la nueva carrera correctamente.']);
    }

    public function removeCoordinatorFromCareer(Request $request)
    {
    // if (auth()->user()->isAdmin !== 1) {
    //     return response()->json(['error' => 'Acceso denegado. Solo los administradores pueden realizar esta operación.'], Response::HTTP_FORBIDDEN);
    // }

    $coordinatorId = $request->input('coordinator_id');
    $careerId = $request->input('career_id');

    $coordinator = Coordinator::findOrFail($coordinatorId);
    $career = Career::findOrFail($careerId);

    // Quitar la asignación de la carrera al coordinador
    $coordinator->career()->detach($careerId);

    return response()->json(['message' => 'La carrera ha sido quitada del coordinador correctamente.']);
    }



    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreCoordinatorRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreCoordinatorRequest $request)
    {
        try{
            $newStudent = coordinator::create($request -> validated());
            return response()->json(['success'=>true,'data'=>new StudentResource($newStudent->load('career'))]);
        }catch(\Throwable $th){
            return response()->json(['success'=>false],500);
        }
    }

    

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Coordinator  $coordinator
     * @return \Illuminate\Http\Response
     */

     public function changePassword(Request $request, $no_employed)
    {

        try {

            // Validar el request
            $validatedData = $request->validate([
                'current_password' => 'required',
                'new_password' => 'required|confirmed',
            ]);
    

            $coordinator = Coordinator::where('no_employed', $no_employed)->firstOrFail();
    
            // Verificar que la contraseña actual sea correcta
            if (!Hash::check($request->current_password, $coordinator->password)) {
                return response()->json(['success' => false, 'message' => 'Current password is incorrect'], 400);
            }
    
            // Actualizar la contraseña
            $coordinator->password = Hash::make($request->new_password);
            $coordinator->save();
    

            return response()->json(['success' => true, 'message' => 'Password updated successfully']);
    
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }

    }

    public function show(Coordinator $coordinator)
    {
        $this->authorize('view', $coordinator);

        try{
            return response()->json(['success'=>true,'data'=>new StudentResource($student->load('career'))]);
        }catch(\Throwable $th){
            return response()->json(['success'=>false], 500);
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Coordinator  $coordinator
     * @return \Illuminate\Http\Response
     */
    public function edit(Coordinator $coordinator)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateCoordinatorRequest  $request
     * @param  \App\Models\Coordinator  $coordinator
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateCoordinatorRequest $request, Coordinator $coordinator)
    {
        try{
            $student -> update($request->validated());
            return response()->json(['success'=>true,'data'=>new StudentResource($student->load('career'))]);
        }catch(\Throwable $th){
            return response()->json(['success'=>false],500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Coordinator  $coordinator
     * @return \Illuminate\Http\Response
     */
    public function destroy(Coordinator $coordinator)
    {
        $this->authorize('delete', $coordinator);

        try{
            $student->delete();
            return response()->json(['success'=>true]);
        }catch(\Throwable $th){
            return response()->json(['success'=>false], 500);
        }
    }

    public function get_careers($id){
        // Obtener el coordinador por su ID con sus relaciones de carreras
        $coordinator = Coordinator::with('career')->where('no_employed', $id)->firstOrFail();

        // Verificar si el coordinador existe
        if (!$coordinator) {
            return response()->json(['error' => 'Email invalido'], 404);
        }

        // Obtener las relaciones de carreras del coordinador
        $careers = $coordinator->career;

        // Retornar las relaciones
        return response()->json(['coordinator_relations' => $careers]);
    }
    
}
