<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateExpedienteFilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('expediente_files', function (Blueprint $table) {
            $table->id();
            $table->string('control_number');
            $table->string('ReportePreliminarStatus')->default('0');
            $table->string('SolicitudResidenciasStatus')->default('0');
            $table->string('CartaPresentacionStatus')->default('0');
            $table->string('CartaAceptacionStatus')->default('0');
           
            $table->foreign('control_number')->references('control_number')->on('students');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('expediente_files');
    }
}
