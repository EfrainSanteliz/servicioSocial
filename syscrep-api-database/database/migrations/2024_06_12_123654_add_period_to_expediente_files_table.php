<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPeriodToExpedienteFilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('expediente_files', function (Blueprint $table) {
            $table->unsignedBigInteger('period_id')->default(1)->after('control_number');
            $table->foreign('period_id')->references('id')->on('periods')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('expediente_files', function (Blueprint $table) {
            $table->dropForeign('expediente_files_period_id_foreign');
            $table ->dropColumn('period_id');
        });
    }
}
