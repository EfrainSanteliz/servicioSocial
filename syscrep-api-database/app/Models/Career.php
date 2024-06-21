<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Career extends Model
{
    use HasFactory;

    public function students(){
        return $this->hasMany(Student::class);
    }

    public function advisers(){
        return $this->hasMany(Adviser::class);
    }

    public function proyect(){
        return $this->belongsToMany(Proyect::class, 'career_proyects');
    }

    public function coordinators()
    {
        return $this->belongsToMany(Coordinator::class, 'coordinator_career');
    }

    public function departaments()
    {
        return $this->belongsToMany(Department::class, 'career_department');
    }

    public function notices()
    {
        return $this->hasMany(Notice::class);
    }

    public function pnotices()
    {
        return $this->hasMany(Pnotice::class);
    }



}
