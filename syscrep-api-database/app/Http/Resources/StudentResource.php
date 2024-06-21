<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
             $lastObservation = $this->observations()
                ->where('residence_student_id', $this->id)
                ->where('status', 1)
                ->orderBy('created_at', 'desc')
                ->first();

                $filteredObservations = $this->observations
                ->where('status', 1)
                ->where('residence_student_id', $this->id);

        return [
            'id' => $this -> id,
            'name' => $this -> name,
            'last_name' => $this -> last_name,
            'second_last_name' => $this -> second_last_name,
            'control_number' => $this -> control_number,
            'email' =>$this-> email,
            'phone_number' =>$this-> phone_number,
            'semester' =>$this-> semester,
            'status' =>$this-> status,             
            'career' => new CareerResource($this->whenLoaded('career')),
            'coordinators' => $this->whenLoaded('career') ? CoordinatorResource::collection($this->career->coordinators)->map(function ($coordinator) {
                return [
                    'id' => $coordinator->id,
                    'name' => $coordinator->Name . ' ' . $coordinator->Last_Name . ' ' . $coordinator->Second_Last_Name
                ];
            }) : [],
            'observations' => $filteredObservations->isNotEmpty() ? ObservationResource::collection($filteredObservations) : [],
          
            'last_observation' => $lastObservation!=null ? $lastObservation->observations : ''

        ];
    }
}
