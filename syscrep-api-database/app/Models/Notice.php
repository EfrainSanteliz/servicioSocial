<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notice extends Model
{
    use HasFactory;

    protected $guarded = ['id'];
    protected $fillable = ['text','file_path'];

    public function career()
    {
        return $this->belongsTo(Career::class);
    }
}


