<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Student;

class FixResidencesStatus extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $controlNumbers = [
            "19330113",
            "18330100",
            "19330064",
            "19330069",
            "19330117",
            "19330103",
            "19330014",
            "19330024",
            "19330161",
            "19330041",
            "19330021",
            "19330092",
            "C19330756",
            "19330148",
            "19330107",
            "19330138",
            "18330082",
            "19330034",
            "19330038",
            "19330017",
            "19330136",
            "19330040",
            "19330122",
            "19330043",
            "19330055",
            "18330071",
            "19330154"
        ];

        $studentsIds = Student::whereIn('control_number', $controlNumbers)->pluck('id');
        
        if ($studentsIds->isNotEmpty()) {
            \DB::table('residences')->whereIn('student_id', $studentsIds)->update(['status' => 9]);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
