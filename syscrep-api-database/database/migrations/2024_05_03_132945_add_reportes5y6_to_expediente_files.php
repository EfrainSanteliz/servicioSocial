<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddReportes5y6ToExpedienteFiles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('expediente_files', function (Blueprint $table) {
            $table->string('Reporte5Status')->default('0')->after('Reporte4Status');;
            $table->string('Reporte6Status')->default('0')->after('Reporte5Status');
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
            $table->dropColumn(['Reporte5Status', 'Reporte6Status']);
        });
    }
}
