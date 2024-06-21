<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormStudent extends Model
{
    use HasFactory;

    // Define la tabla asociada al modelo
    protected $table = 'form_students';

    // Define los campos que pueden ser asignados masivamente
    protected $fillable = [
        'control_number',
        'calleyNum',
        'colonia',
        'ciudad',
        'telefonoCelular',
        'telefonoCasa',
        'nss',
        'genero',
        'correoInstitucional',
        'correoPersonal',
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
        'sectorEmpresa',
        'giroEmpresa',
        'EsInstitucionAcademica',
        'EsEmpresaSinFinesDeLucro',
        'Industria',
        'OrigenProyecto',
        'nombreProyecto',
        'numeroEstudiantes',
        'fechaInicio',
        'fechaFin',
        'nombreAsesorInterno',
        'nombreAsesorExterno',
        'puestoAsesorExterno',
        'correoAsesorExterno',
        'numeroAsesorExterno',
        'AsesorExternoEgresadoITH'
    ];

    public function student()
    {
        return $this->hasOne(Student::class, 'control_number', 'control_number');
    }

}


