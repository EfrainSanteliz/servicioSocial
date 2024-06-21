<?php
# Recurso usado para recopilar los datos que se muestran al generar un archivo excel.

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class StudentInformationResource extends JsonResource
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
            'name' => $this -> full_name,
            'control_number' => $this -> control_number,
            'form_data' => new StudentFormResource($this->whenLoaded('formStudent'))
        ];
    }
}
