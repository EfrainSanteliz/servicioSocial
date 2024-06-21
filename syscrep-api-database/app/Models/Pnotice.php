<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pnotice extends Model
{
    use HasFactory;

    protected $guarded = ['id'];
    protected $fillable = ['ptext','file_path' , 'id_student', 'id_coordinator'];


    public function students(){
    return $this->hasMany(Student::class);
    }
}
