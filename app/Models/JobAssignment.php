<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class JobAssignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'repair_service_proposal_id',
        'mechanic_id',
        'notes'
    ];

    protected $with = ['mechanic'];

    public function repairServiceProposal()
    {
        return $this->belongsTo(RepairServiceProposal::class);
    }

    public function mechanic()
    {
        return $this->belongsTo(User::class, 'mechanic_id');
    }
}
