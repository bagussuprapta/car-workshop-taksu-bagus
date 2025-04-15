<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CarRepair extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'car_model', 'date_brought', 'status'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function proposals()
    {
        return $this->hasMany(RepairServiceProposal::class);
    }

    public function complaints()
    {
        return $this->hasMany(Complaint::class);
    }

    public function jobAssignments()
    {
        return $this->hasMany(JobAssignment::class);
    }
}
