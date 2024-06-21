<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCompanyToProyectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('proyects', function (Blueprint $table) {
            $table -> unsignedBigInteger('company_id');
            $table -> foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('proyects', function (Blueprint $table) {
            $table->dropForeign('proyects_company_id_foreign');
            $table ->dropColumn('company_id');
        });
    }
}
