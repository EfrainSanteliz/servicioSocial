<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePnoticeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pnotices', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('student_id')->nullable();
            $table->unsignedBigInteger('id_coordinator')->nullable();
            $table->string('ptext');
            $table->string('file_path');
            $table->timestamps();
            $table->foreign('student_id')->references('id')->on('students')->onDelete('set null');
            $table->foreign('id_coordinator')->references('id')->on('coordinators')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pnotices');
    }
}
