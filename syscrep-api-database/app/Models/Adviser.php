<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Database\Eloquent\Model;

class Adviser extends Authenticatable implements JWTSubject
{
    use HasFactory;

    protected $guarded = [ 'id' ];
    protected $hidden = [ 'password' ];
    protected $filable = ['name','last_name','second_last_name','department_id','email', 
    'phone_number',];

     /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    public function career()
    {
        return $this->belongsTo(Career::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function residences(){
        return $this->hasMany(Residence::class);
    }
}