<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ResidenceResource extends JsonResource
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
            'student' => new StudentResource($this->whenLoaded('student')),
            'proyect' => new ProyectResource($this->whenLoaded('proyect')),
            'adviser' => new AdviserResource($this->whenLoaded('adviser')),
            'status' => $this -> status,
            'observations' => $this -> observations,
            'expediente' => new ExpedienteFileResource($this -> student -> ExpedienteFile),
            'updated' => $this -> updated_at,
            'selectedProyect' => $this -> selectedProyect,
            'periodo' => new PeriodResource($this -> whenLoaded('period'))
        ];
       
    }
}
