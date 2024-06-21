<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddNewFieldToCompaniesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('companies', function (Blueprint $table) {

            $table->dropColumn('name');
            $table->dropColumn('address');
            $table->dropColumn('phone_number');
            $table->dropColumn('in_charge');
            $table->dropColumn('type');
            $table->dropColumn('email');
         //
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
            $table->string('document')->nullable();


        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('companies', function (Blueprint $table) {
           //name
           
        
           $table->dropColumn('razonSocial');
           $table->dropColumn('nombreEmpresa');
           $table->dropColumn('rfcEmpresa');
           $table->dropColumn('misionEmpresa');
           $table->dropColumn('direccionEmpresa');
           $table->dropColumn('coloniaEmpresa');
           $table->dropColumn('telefonoEmpresa');
           $table->dropColumn('correoEmpresa');
           $table->dropColumn('ciudadEmpresa');
           $table->dropColumn('cpEmpresa');
           $table->dropColumn('tituloPersonatitular'); //ej ing, doc, lic etc
           $table->dropColumn('nombrePersonatitular');
           $table->dropColumn('cargoPersonatitular');
           $table->dropColumn('responsableResidencias');
           $table->dropColumn('cargoResponsableResidencias');
           $table->dropColumn('tamañoEmpresa');
           $table->dropColumn('sectorEmpresa');
           $table->dropColumn('giroEmpresa');
           $table->dropColumn('EsInstitucionAcademica');
           $table->dropColumn('EsEmpresaSinFinesDeLucro');
           $table->dropColumn('Industria');
           $table->dropColumn('document');

        });
    }
}
