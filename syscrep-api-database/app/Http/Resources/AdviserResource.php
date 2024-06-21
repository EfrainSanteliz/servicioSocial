<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AdviserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this -> id,
            'name' => $this -> name,
            'last_name' => $this -> last_name,
            'second_last_name' => $this -> second_last_name,
            'employee_number' =>$this->employee_number,
            'email' =>$this->email,
            'phone_number' =>$this->phone_number,
            'department' => new DepartmentResource($this->whenLoaded('department'))
        ];
    }
}
