<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCoordinatorRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return auth()->user()->can('update',$this->route('coordinator'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required|string',
            'last_name' => 'required|string',
            'second_last_name' => 'required|string',
            'control_number' => 'required|string|unique:students,control_number,'.$this->route('student')->id,
            'career_id' => 'required|integer|exists:careers,id',
            'password'=>'sometimes|confirmed'
        ];
    }
}
