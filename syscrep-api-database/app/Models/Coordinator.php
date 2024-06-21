<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Database\Eloquent\Model;

class Coordinator extends Authenticatable implements JWTSubject
{
    use HasFactory;

    protected $guarded = [ 'id' ];
    protected $hidden = [ 'password' ];

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
        return $this->belongsToMany(Career::class, 'coordinator_career');
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
