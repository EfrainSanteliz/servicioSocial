<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFormStudentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('form_students', function (Blueprint $table) {
            $table->id();
            $table->string('control_number');
            $table->string('calleyNum')->nullable();
            $table->string('colonia')->nullable();
            $table->string('ciudad')->nullable();
            $table->string('telefonoCelular')->nullable();
            $table->string('telefonoCasa')->nullable();
            $table->string('nss')->nullable();
            $table->string('genero')->nullable();
            $table->string('correoInstitucional')->nullable();
            $table->string('correoPersonal')->nullable();
            $table->string('razonSocial')->nullable();
            $table->string('nombreEmpresa')->nullable();
            $table->string('rfcEmpresa')->nullable();
            $table->string('misionEmpresa')->nullable();
            $table->string('direccionEmpresa')->nullable();
            $table->string('coloniaEmpresa')->nullable();
            $table->string('telefonoEmpresa')->nullable();
            $table->string('correoEmpresa')->nullable();
            $table->string('ciudadEmpresa')->nullable();
            $table->string('cpEmpresa')->nullable();
            $table->string('tituloPersonatitular')->nullable(); //ej ing, doc, lic etc
            $table->string('nombrePersonatitular')->nullable();
            $table->string('cargoPersonatitular')->nullable();
            $table->string('responsableResidencias')->nullable();
            $table->string('cargoResponsableResidencias')->nullable();
            $table->string('tamañoEmpresa')->nullable();
            $table->string('sectorEmpresa')->nullable();
            $table->string('giroEmpresa')->nullable();
            $table->string('EsInstitucionAcademica')->nullable();
            $table->string('EsEmpresaSinFinesDeLucro')->nullable();
            $table->string('Industria')->nullable();
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
            $table->timestamps();

            $table->foreign('control_number')->references('control_number')->on('students');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('form_students');
    }
}
