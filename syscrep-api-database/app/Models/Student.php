<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Database\Eloquent\Model;


class Student extends Authenticatable implements JWTSubject
{
    use HasFactory;

    protected $guarded = [ 'id' ];
    protected $hidden = [ 'nip' ];
    protected $filable = ['name','last_name','second_last_name','control_number','semester','email',
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

    public function getFullNameAttribute()
    {
        return "{$this->last_name} {$this->second_last_name} {$this->name} ";
    }

    public function career(){
        return $this -> belongsTo(Career::class);
    }

    public function residences(){
        return $this->hasMany(Residence::class);
    }

    public function getAuthPassword(){
        return $this->nip;
    }
    public function formStudent()
    {
        return $this->hasOne(FormStudent::class, 'control_number', 'control_number');
    }

    public function ExpedienteFile()
    {
        return $this->hasOne(ExpedienteFile::class, 'control_number', 'control_number');
    }

    public function observations()
    {
        return $this->hasMany(Observation::class, 'residence_student_id');
    }

    public function pnotices()
    {
        return $this->hasMany(Pnotice::class);
    }
}
