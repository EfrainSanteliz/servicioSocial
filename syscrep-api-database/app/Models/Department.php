<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    public function advisers(){
        return $this->hasMany(Adviser::class);
    }

    public function coordinator(){
        return $this->hasMany(Coordinator::class);
    }

    public function career()
    {
        return $this->belongsToMany(Career::class, 'career_department');
    }
}
