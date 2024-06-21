<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ExpedienteFileResource extends JsonResource
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
            'updated' => $this -> updated_at,
            'files' => [
                    "ReportePreliminarStatus" => $this -> ReportePreliminarStatus,
                    "SolicitudResidenciasStatus" => $this -> SolicitudResidenciasStatus,
                    "CartaPresentacionStatus" => $this -> CartaPresentacionStatus,
                    "CartaAceptacionStatus" => $this -> CartaAceptacionStatus,
                    "Reporte1Status" => $this ->  Reporte1Status,
                    "Reporte2Status" => $this -> Reporte2Status,
                    "Reporte3Status" => $this -> Reporte3Status,
                    "Reporte4Status" => $this -> Reporte4Status,
                    "Reporte5Status" => $this -> Reporte5Status,
                    "Reporte6Status" => $this -> Reporte6Status
                ]
        ];
    }
}
