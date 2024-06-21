<?php

namespace App\Http\Controllers;

use App\Models\Proyect;
use App\Http\Requests\StoreProyectRequest;
use App\Http\Requests\UpdateProyectRequest;
use App\Http\Resources\ProyectResource;
use App\Models\Company;



class ProyectController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            // Cargar los proyectos con la relación de compañía
            $proyects = Proyect::with('company')->get();
            
            // Retornar la respuesta JSON con los datos y la relación cargada
            return response()->json(['success' => true, 'data' => ProyectResource::collection($proyects)]);
        } catch (\Throwable $th) {
            // Manejo de errores
            return response()->json(['success' => false, 'message' => $th->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreProyectRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreProyectRequest $request)
    {
        try {

            $newProyect = Proyect::create($request->all());
    
            return response()->json(['success' => true, 'data' => new ProyectResource($newProyect)]);
        } catch (\Throwable $th) {
            // Manejar el error
            return response()->json(['success' => false, 'message' => $th->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Proyect  $proyect
     * @return \Illuminate\Http\Response
     */
    public function show($company_id)
    {
        try {
            $proyects = Proyect::where('company_id', $company_id)->get();
            
            if ($proyects->isEmpty()) {
                return response()->json(['success' => false, 'message' => 'No se encontraron proyectos para este company_id'], 404);
            }
    
            return response()->json(['success' => true, 'data' => ProyectResource::collection($proyects)]);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => 'Error interno del servidor'], 500);
        }
    }

    public function showbyProyectId(Proyect $proyect)
    {
        try {
            return response()->json(['success' => true, 'data' => new ProyectResource($proyect)]);
        } catch (\Throwable $th) {
            // Handle the error
            return response()->json(['success' => false, 'message' => $th->getMessage()]);
        }
    }
    

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateProyectRequest  $request
     * @param  \App\Models\Proyect  $proyect
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateProyectRequest $request, Proyect $proyect)
    {
        try {
            $proyect->update($request->all());
            return response()->json(['success' => true, 'data' => new ProyectResource($proyect), 'message' => 'Proyecto actualizado correctamente']);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => 'Error al actualizar el proyecto']);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Proyect  $proyect
     * @return \Illuminate\Http\Response
     */
    public function destroy(Proyect $proyect)
    {
        try {
            $proyect->delete();
            return response()->json(['success' => true, 'message' => 'Proyecto eliminado correctamente']);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => 'Error al eliminar el proyecto']);
        }
    }
}
