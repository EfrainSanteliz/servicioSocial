<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProyectRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [

            
        //    'name' => 'required|string',
         //   'description' => 'required|string',
         //   'requirements' => 'required|string',
         //   'offer' => 'required|string',
         //   'expiration' => 'required|string',
         //   'remuneration' => 'required|string',
           // 'resident_number' => 'required|integer',
          //  'email' => 'required|string',
            //'phone_number' => 'required|string',

        

        ];
    }
}
