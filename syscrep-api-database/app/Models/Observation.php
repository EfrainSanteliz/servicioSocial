<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Observation extends Model
{
    use HasFactory;

    protected $fillable = ['observations'];

    public function residence(){
        return $this -> belongsTo(Residence::class);
    }

    public function deshabilitar()
    {
        $this->status = 0; 
        $this->save();
    }
}
