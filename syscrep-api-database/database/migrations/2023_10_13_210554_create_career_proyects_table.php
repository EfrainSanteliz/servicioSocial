<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCareerProyectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('career_proyects', function (Blueprint $table) {
            $table->id();
            $table->unsignedBiginteger('career_id')->unsigned();
            $table->unsignedBiginteger('proyect_id')->unsigned();

            $table->foreign('career_id')->references('id')->on('careers')->onDelete('cascade');
            $table->foreign('proyect_id')->references('id')->on('proyects')->onDelete('cascade');

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
        Schema::dropIfExists('career_proyects');
    }
}
