<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddNewFieldToProyectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('proyects', function (Blueprint $table) {


            $table->dropColumn('name');
            $table->dropColumn('description');
            $table->dropColumn('requirements');
            $table->dropColumn('offer');
            $table->dropColumn('expiration');
            $table->dropColumn('remuneration');
            $table->dropColumn('resident_number');
            $table->dropColumn('email');
            $table->dropColumn('phone_number');
        
            $table->string('OrigenProyecto')->nullable();
            $table->string('nombreProyecto')->nullable();
            $table->string('numeroEstudiantes')->nullable();
            $table->string('fechaInicio')->nullable();
            $table->string('fechaFin')->nullable();
            $table->string('nombreAsesorInterno')->nullable();
            $table->string('nombreAsesorExterno')->nullable();
            $table->string('puestoAsesorExterno')->nullable();
            $table->string('correoAsesorExterno')->nullable();
            $table->string('numeroAsesorExterno')->nullable();
            $table->string('AsesorExternoEgresadoITH')->nullable();

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('proyects', function (Blueprint $table) {
        
            $table->dropColumn('OrigenProyecto');
            $table->dropColumn('nombreProyecto');
            $table->dropColumn('numeroEstudiantes');
            $table->dropColumn('fechaInicio');
            $table->dropColumn('fechaFin');
            $table->dropColumn('nombreAsesorInterno');
            $table->dropColumn('nombreAsesorExterno');
            $table->dropColumn('puestoAsesorExterno');
            $table->dropColumn('correoAsesorExterno');
            $table->dropColumn('numeroAsesorExterno');
            $table->dropColumn('AsesorExternoEgresadoITH');
        });
    }
}
