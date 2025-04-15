<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory;

    protected $fillable = ['name', 'email', 'password', 'role'];

    protected $casts = [
        'role' => 'string'
    ];

    public static $roles = ['admin', 'car_owner', 'mechanic'];

    public function carRepairs()
    {
        return $this->hasMany(CarRepair::class);
    }

    public function jobAssignments()
    {
        return $this->hasMany(JobAssignment::class);
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function setRoleAttribute($value)
    {
        if (!in_array($value, self::$roles)) {
            throw new \InvalidArgumentException("Invalid role: {$value}. Valid roles are: " . implode(', ', self::$roles));
        }
        $this->attributes['role'] = $value;
    }
}
