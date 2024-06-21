<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCoordinatorCareer extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('coordinator_career', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('coordinator_id')->nullable(); // Hacer nullable
            $table->unsignedBigInteger('career_id')->nullable(); 
            $table->timestamps();

            $table->foreign('coordinator_id')->references('id')->on('coordinators')->onDelete('set null');
            $table->foreign('career_id')->references('id')->on('careers')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('coordinator_career');
    }
}
