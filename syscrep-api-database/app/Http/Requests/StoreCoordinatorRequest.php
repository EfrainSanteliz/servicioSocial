<?php

namespace App\Http\Requests;
use App\coordinator;
use Illuminate\Foundation\Http\FormRequest;

class StoreCoordinatorRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return auth()->user()->can('create',coordinator::class);
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
            'control_number' => 'required|string|unique:students,control_number',
            'career_id' => 'required|integer|exists:careers,id',
            'password'=>'required|confirmed'
        ];
    }
}
