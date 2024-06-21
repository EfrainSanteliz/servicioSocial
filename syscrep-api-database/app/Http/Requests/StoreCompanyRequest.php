<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCompanyRequest extends FormRequest
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
        //'name' => [
         //   'required',
         //   'string',
       //     Rule::unique('companies', 'name'),
       // ],
       // 'address' => 'required|string',
       // 'phone_number' => 'required|string',
       // 'in_charge' =>'required|string',
       // 'type' =>'required|string',
       // 'email' => 'required|email',
        // Add other validation rules for additional fields here
    ];
}
}