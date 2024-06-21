<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class StudentFormResource extends JsonResource
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
            'sexo' => $this -> genero,
            'proyecto_preliminar' => $this -> nombreProyecto,
            'empresa' => $this -> nombreEmpresa,
            'sector' => $this -> sectorEmpresa,
            'asesor_interno' => $this -> nombreAsesorInterno,
            'asesor_externo' => $this -> nombreAsesorExterno
        ];
    }
}
