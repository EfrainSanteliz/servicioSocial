<?php

namespace App\Http\Controllers;

use App\Models\Adviser;
use App\Http\Resources\AdviserResource;
use App\Http\Requests\StoreAdviserRequest;
use App\Http\Requests\UpdateAdviserRequest;
use Illuminate\Support\Facades\Hash;


class AdviserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try{
            $adviser = Adviser::with('department')->get();
            return response()->json(['success'=>true,'data'=>AdviserResource::collection($adviser)]);
        }catch(\Throwable $th){
            echo $th;
            return response()->json(['success'=>false],500);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreAdviserRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreAdviserRequest $request)
    {
    try {
        
        $request->merge(['password' => Hash::make($request->password)]);
        

        $newAdviser = Adviser::create($request -> all());
        
        

        return response()->json(['success' => true, 'data' => $newAdviser->load('department')]);
    } catch (\Throwable $th) {
        // Manejar el error
        return response()->json(['success' => false, 'message' => $th->getMessage()]);
    }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Adviser  $adviser
     * @return \Illuminate\Http\Response
     */
    public function show(Adviser $adviser)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateAdviserRequest  $request
     * @param  \App\Models\Adviser  $adviser
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateAdviserRequest $request, Adviser $adviser)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Adviser  $adviser
     * @return \Illuminate\Http\Response
     */
    public function destroy(Adviser $adviser)
    {
        //
    }
}
