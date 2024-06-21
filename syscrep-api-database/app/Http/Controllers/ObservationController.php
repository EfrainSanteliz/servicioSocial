<?php

namespace App\Http\Controllers;

use App\Models\Observation;
use App\Http\Requests\StoreObservationRequest;
use App\Http\Requests\UpdateObservationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Residence;

class ObservationController extends Controller
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
    public function create(Request $request, $residence_id)
    {
        try{
            $residence = Residence::findOrFail($residence_id);

            $observacion = new Observation([
                'observations' => $request->json('observations'),
            ]);

            if($request->exists('file')){
                $observacion ->file = $request->json('file');
            }

            $residence->observations()->save($observacion);

            return response()->json(['success'=>true,'observation'=>$observacion]);
        }catch(\Throwable $th){
            return response()->json(['success'=>false,'observation'=>$request,'message'=>$th->getMessage()],500);
        }
    }

    public function getObservationsByStudentId($residence_student_id)
    {
        
        $observations = Observation::where(['residence_student_id'=> $residence_student_id, 'status'=>1])
        ->orderBy('id', 'desc')
        ->get();

        return response()->json(['success' => true, 'data' => $observations], 200);
    }
    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Observation  $observation
     * @return \Illuminate\Http\Response
     */
    public function show($residence_id)
    {
        try{
            $residence = Residence::find($residence_id);
            $observations = $residence->observations;
            return response()->json(['success'=>true,'observations'=>$observations]);
        }catch(\Throwable $th){
            return response()->json(['success'=>false,'observations'=>[],'message'=>$th->getMessage()], 500);
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Observation  $observation
     * @return \Illuminate\Http\Response
     */
    public function edit(Request $request, $observationId)
    {
        Log::info('Before updating observation');
        // Validate the request data
        $this->validate($request, [
            'new_observation' => 'required|string',
        ]);
    
        try {
            // Find the observation by ID
            $observation = Observation::findOrFail($observationId);

            // Update the observation
            $observation->update([
                'observations' => $request->input('new_observation'),
            ]);
    
            // Optionally, you can also update other fields if needed
            Log::info('After updating observation');
            // Return success response
            return response()->json(['success' => true, 'message' => 'Observation updated successfully'], 200);
        } catch (\Exception $e) {
            // Return error response if an exception occurs
            return response()->json(['success' => false, 'message' => 'Error updating observation', 'error' => $e->getMessage()], 500);
        }
     
    }

    public function deshabilitar($observationId)
    {       
    
        try {
            // Find the observation by ID
            $observation = Observation::findOrFail($observationId);

            $observation->deshabilitar();
    
          
            return response()->json(['success' => true, 'message' => 'Observation Eliminada Exitosamente.'], 200);
        } catch (\Exception $e) {
            // Return error response if an exception occurs
            return response()->json(['success' => false, 'message' => 'Error to delete observation', 'error' => $e->getMessage()], 500);
        }
     
    }
}
