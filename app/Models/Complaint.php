<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Complaint extends Model
{
    use HasFactory;

    protected $fillable = ['car_repair_id', 'description', 'status'];

    public function carRepair()
    {
        return $this->belongsTo(CarRepair::class);
    }
}
