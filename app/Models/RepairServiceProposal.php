<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RepairServiceProposal extends Model
{
    use HasFactory;

    protected $fillable = ['car_repair_id', 'service_id', 'status'];

    public function carRepair()
    {
        return $this->belongsTo(CarRepair::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function jobAssignments()
    {
        return $this->hasMany(JobAssignment::class);
    }
}
