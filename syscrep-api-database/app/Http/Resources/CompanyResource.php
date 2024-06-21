<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CompanyResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
 
            'id'=>$this->id,
    'razonSocial' => $this->razonSocial,
    'nombreEmpresa' => $this->nombreEmpresa,
    'rfcEmpresa' => $this->rfcEmpresa,
    'misionEmpresa' => $this->misionEmpresa,
    'direccionEmpresa' => $this->direccionEmpresa,
    'coloniaEmpresa' => $this->coloniaEmpresa,
    'telefonoEmpresa' => $this->telefonoEmpresa,
    'correoEmpresa' => $this->correoEmpresa,
    'ciudadEmpresa' => $this->ciudadEmpresa,
    'cpEmpresa' => $this->cpEmpresa,
    'tituloPersonatitular' => $this->tituloPersonatitular,
    'nombrePersonatitular' => $this->nombrePersonatitular,
    'cargoPersonatitular' => $this->cargoPersonatitular,
    'responsableResidencias' => $this->responsableResidencias,
    'cargoResponsableResidencias' => $this->cargoResponsableResidencias,
    'tamañoEmpresa' => $this->tamañoEmpresa,
    'sectorEmpresa' => $this->sectorEmpresa,
    'giroEmpresa' => $this->giroEmpresa,
    'EsInstitucionAcademica' => $this->EsInstitucionAcademica,
    'EsEmpresaSinFinesDeLucro' => $this->EsEmpresaSinFinesDeLucro,
    'Industria' => $this->Industria,
    'document' => $this->document

        ];
    }
}