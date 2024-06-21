<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Proyect extends Model
{
    use HasFactory;

    protected $guarded = ['id'];
    protected $fillable = [
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
        'AsesorExternoEgresadoITH',
        'company_id'
    ];

    
    public function company(){
        return $this->belongsTo(Company::class);
    }

    public function residences(){
        return $this->hasMany(Residence::class);
    }

    public function career(){
        return $this->belongsToMany(Career::class, 'career_proyects');
    }
}
