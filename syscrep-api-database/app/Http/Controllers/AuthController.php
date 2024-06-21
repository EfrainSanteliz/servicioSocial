<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\{CoordinatorResource,StudentResource};


class AuthController extends Controller
{
    public function StudentLogin(Request $request) 
    {
        
        try {
            $credenciales = $request->only('control_number', 'nip');
            //dd($credenciales);
            $token = Auth::guard('student')->attempt(array(
                'control_number' => $credenciales['control_number'],
                'password' => $credenciales['nip']
            ));
        
            if ($token) {            
                return response()->json(['success' => true, 'token' => $token]);
            } else {
                return response()->json(['success' => false], 401);
            }
        } catch (\Exception $th) {
            // Manejar la excepción
            return response()->json(['success' => false, 'error' => $th->getMessage()], 500);
        }
    }


    public function studentMe(){
        try{

            return response()->json([
                'success'=> true,
                'control_number' => new StudentResource( Auth::guard('student')->user() )
                ]);
        }catch(\Throwable $th){
            return response()->json(['success'=>false],500);
        }
    }

    public function studentLogout(){
        try{
            Auth::guard('student')->logout();
            return response()->json(['success'=>true]);
        }catch(\Throwable $th){
            return response()->json(['success'=>false], 500);
        }
    }

    public function CoordinatorLogin(Request $request){
        $credenciales = $request -> only('no_employed', 'password');
        //dd($credenciales);
        $token = Auth::guard('coordinator') -> attempt(array(
            'no_employed' => $credenciales['no_employed'],
            'password'=> $credenciales['password']
            )
        );
        
        if ($token)
        {            
            return response()->json(['success'=> true, 'token' => $token]);
        }
        else
        {
            return response()->json(['success'=> false], 401);
        }

    }

    public function CoordinatorMe(){
        try{
            return response()->json([
                'success'=> true,
                'coordinador' => new CoordinatorResource( Auth::guard('coordinator')->user()->load('career', 'department') )
                ]);
        }catch(\Throwable $th){
            return response()->json(['success'=>false,'error' => $th->getMessage()],500);
        }
    }

    public function CoordinatorLogout(){
        try{
            Auth::guard('coordinator')->logout();
            return response()->json(['success'=>true]);
        }catch(\Throwable $th){
            return response()->json(['success'=>false], 500);
        }
    }

    public function ResidenceLogin(Request $request){
        $credenciales = $request -> only('no_employed', 'password');
        //dd($credenciales);
        $token = Auth::guard('coordinator') -> attempt(array(
            'no_employed' => $credenciales['no_employed'],
            'password'=> $credenciales['password']
            )
        );
        
        if ($token)
        {            
            return response()->json(['success'=> true, 'token' => $token]);
        }
        else
        {
            return response()->json(['success'=> false], 401);
        }

    }





}
