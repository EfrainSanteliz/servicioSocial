<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    protected $guarded = ['id'];
    protected $fillable = [

        'razonSocial',
        'nombreEmpresa',
        'rfcEmpresa',
        'misionEmpresa',
        'direccionEmpresa',
        'coloniaEmpresa',
        'telefonoEmpresa',
        'correoEmpresa',
        'ciudadEmpresa',
        'cpEmpresa',
        'tituloPersonatitular',
        'nombrePersonatitular',
        'cargoPersonatitular',
        'responsableResidencias',
        'cargoResponsableResidencias',
        'tamañoEmpresa',
        'sectorEmpresa' ,
        'giroEmpresa',
        'EsInstitucionAcademica',
        'EsEmpresaSinFinesDeLucro',
        'Industria',
        'document',
    ];


    public function proyects(){
        return $this->hasMany(Proyect::class);
    }


}
