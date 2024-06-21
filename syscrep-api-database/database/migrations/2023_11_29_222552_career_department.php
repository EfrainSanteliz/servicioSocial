<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CareerDepartment extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('career_department', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('departament_id')->nullable(); // Hacer nullable
            $table->unsignedBigInteger('career_id')->nullable(); 
            $table->timestamps();

            $table->foreign('departament_id')->references('id')->on('departments')->onDelete('set null');
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
        Schema::dropIfExists('career_department');

    }
}
