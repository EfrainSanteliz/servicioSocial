<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProyectResource extends JsonResource
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
            'id'=>$this->id,
            'OrigenProyecto'=>$this->OrigenProyecto,
            'nombreProyecto' => $this -> nombreProyecto,
            'numeroEstudiantes' => $this -> numeroEstudiantes,
            'fechaInicio' => $this -> fechaInicio,
            'fechaFin' => $this -> fechaFin,
            'nombreAsesorInterno' => $this -> nombreAsesorInterno,
            'nombreAsesorExterno' => $this -> nombreAsesorExterno,
            'puestoAsesorExterno' => $this -> puestoAsesorExterno,
            'correoAsesorExterno' => $this -> correoAsesorExterno,
            'numeroAsesorExterno' => $this -> numeroAsesorExterno,
            'AsesorExternoEgresadoITH' => $this -> AsesorExternoEgresadoITH,
            'company_id' => $this -> company_id,
            'company' => new CompanyResource($this->company), // Incluyendo la relación company
        ];
    }
}
