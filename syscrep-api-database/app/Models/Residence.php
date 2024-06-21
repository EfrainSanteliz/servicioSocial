<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Residence extends Model
{
    use HasFactory;

    protected $fillable = ['student_id', 'project_id', 'adviser_id', 'status', 'observations', 'url', 'period_id'];
    protected $primaryKey = 'student_id';

    public function student(){
        return $this -> belongsTo(Student::class);
    }

    public function proyect(){
        return $this -> belongsTo(Proyect::class);
    }

    public function adviser(){
        return $this -> belongsTo(Adviser::class);
    }

    public function observations(){
        return $this ->hasMany(Observation::class);
    }

    public function period(){
        return $this ->belongsTo(Period::class);
    }
}
