<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Service extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'price'];

    public function repairServiceProposals()
    {
        return $this->hasMany(RepairServiceProposal::class);
    }
}
