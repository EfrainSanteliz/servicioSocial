<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class FixObservationsInObservations extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::table('observations')
            ->where('observations', 'El reporte ha sido revisado por la academia. Ahora solo tienes que esperar a que tu asesor lo acepte.')
            ->update(['observations' => 'Asesor asignado']);

        DB::table('observations')
            ->where('observations', 'El reporte ha sido revisado por la academia. Espera hasta que se te haya asignado un asesor')
            ->update(['observations' => 'El reporte ha sido revisado por la academia.']);

        DB::table('observations')
            ->where('observations', 'Se le informa que su reporte preliminar ha sido ACEPTADO. Para continuar es necesario llenar el formulario en el paso 3.')
            ->update(['observations' => 'El reporte preliminar ha sido ACEPTADO.']);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('observations', function (Blueprint $table) {
            //
        });
    }
}
