<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class ExpedienteFile extends Model
{
    use HasFactory;

    protected $table = 'expediente_files';

    protected $fillable = [
        'control_number',
        'ReportePreliminarStatus',
        'SolicitudResidenciasStatus',
        'CartaPresentacionStatus',
        'CartaAceptacionStatus',
        'Reporte1Status',
        'Reporte2Status',
        'Reporte3Status',
        'Reporte4Status',

    ];

    public function student()
    {
        return $this->hasOne(Student::class, 'control_number', 'control_number');
    }

}
