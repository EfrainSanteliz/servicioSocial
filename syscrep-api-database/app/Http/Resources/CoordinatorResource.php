<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CoordinatorResource extends JsonResource
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
            'id'=>$this ->id,
            'no_employed' => $this -> no_employed,
            'company' => $this -> company,
            'Actual_state' => $this -> Actual_state,
            'Name' => $this -> Name,
            'Last_Name' => $this -> Last_Name,
            'Second_Last_Name' => $this -> Second_Last_Name,
            'careers' => CareerResource::collection($this->whenLoaded('career')),
            'department' => new DepartmentResource($this->whenLoaded('department')),
            'isAdmin' => $this -> isAdmin,
        ];
    }
}
