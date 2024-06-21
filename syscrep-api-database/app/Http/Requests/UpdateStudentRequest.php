<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStudentRequest extends FormRequest
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
           // 'name' => 'required|string',
           // 'last_name' => 'required|string',
           // 'second_last_name' => 'required|string',
            //'control_number' => 'required|string|unique:students,control_number,' . $this->student,
           // 'career_id' => 'required|integer|exists:careers,id',
           // 'nip'=>'sometimes|confirmed'
        ];
    }
}
