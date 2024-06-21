<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCoordinatorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('coordinators', function (Blueprint $table) {
           
            $table->bigIncrements('id');
            $table->string('no_employed');
            $table->string('password');
            $table->string('company');
            $table->string('Actual_state');
            $table->string('Name');
            $table->string('Last_Name');
            $table->string('Second_Last_Name');
            $table->string('State');
            $table->integer('isAdmin')->default(0);
            
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
        Schema::dropIfExists('coordinators');
    }
}
