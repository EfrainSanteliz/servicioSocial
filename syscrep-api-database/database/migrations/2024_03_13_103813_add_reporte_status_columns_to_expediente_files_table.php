<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddReporteStatusColumnsToExpedienteFilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('expediente_files', function (Blueprint $table) {
            $table->string('Reporte4Status')->default('0')->after('CartaAceptacionStatus');;
            $table->string('Reporte3Status')->default('0')->after('CartaAceptacionStatus');
            $table->string('Reporte2Status')->default('0')->after('CartaAceptacionStatus');
            $table->string('Reporte1Status')->default('0')->after('CartaAceptacionStatus');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('expediente_files', function (Blueprint $table) {
            $table->dropColumn(['Reporte1Status', 'Reporte2Status', 'Reporte3Status', 'Reporte4Status']);
        });
    }
}
