<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateResidencesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('residences', function (Blueprint $table) {
            $table -> unsignedBigInteger('student_id');
            $table->foreign('student_id')->references('id')->on('students')->onDelete('cascade');
            $table -> unsignedBigInteger('proyect_id')->nullable();
            $table->foreign('proyect_id')->references('id')->on('proyects')->onDelete('cascade');
            $table -> unsignedBigInteger('adviser_id')->nullable();
            $table->foreign('adviser_id')->references('id')->on('advisers')->onDelete('cascade');
            $table -> string('status');
            $table -> string('observations',10000);
            $table -> string('url');
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
        Schema::dropIfExists('residences');
    }
}
