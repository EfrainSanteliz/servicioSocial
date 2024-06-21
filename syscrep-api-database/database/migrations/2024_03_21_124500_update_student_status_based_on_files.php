<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use App\Models\ExpedienteFile;


class UpdateStudentStatusBasedOnFiles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $expedienteFiles = ExpedienteFile::all();

        foreach ($expedienteFiles as $expedienteFile) {
            $controlNumber = $expedienteFile->control_number;
            $folderPath = "Archivos_Alumnos/{$controlNumber}/";
    
            // Actualizar los estados basados en los archivos
            $expedienteFile->ReportePreliminarStatus = Storage::disk('local')->exists($folderPath . "Reporte_Preliminar_Aprobado_Firmado_{$controlNumber}.pdf") ? 1 : 0;
            $expedienteFile->SolicitudResidenciasStatus = Storage::disk('local')->exists($folderPath . "Formato_Solicitud_Residencias_Firmado_{$controlNumber}.pdf") ? 1 : 0;
            $expedienteFile->CartaPresentacionStatus = Storage::disk('local')->exists($folderPath . "Carta_Presentacion_Aprobada_Firmada_{$controlNumber}.pdf") ? 1 : 0;
            $expedienteFile->CartaAceptacionStatus = Storage::disk('local')->exists($folderPath . "Carta_Aceptacion_{$controlNumber}.pdf") ? 1 : 0;
    
            $expedienteFile->Reporte1Status = Storage::disk('local')->exists($folderPath . "Reporte_1_{$controlNumber}.pdf") ? 1 : 0;
            $expedienteFile->Reporte2Status = Storage::disk('local')->exists($folderPath . "Reporte_2_{$controlNumber}.pdf") ? 1 : 0;
            $expedienteFile->Reporte3Status = Storage::disk('local')->exists($folderPath . "Reporte_3_{$controlNumber}.pdf") ? 1 : 0;
            $expedienteFile->Reporte4Status = Storage::disk('local')->exists($folderPath . "Reporte_4_{$controlNumber}.pdf") ? 1 : 0;
    
            $expedienteFile->save();
             }
         
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }

    private function checkFileExists($files, $filename)
    {
        return in_array($filename, $files);
    }
}
