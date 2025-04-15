<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RepairServiceProposal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class MechanicController extends Controller
{
    public function getJobs()
    {
        try {
            $mechanicId = Auth::id();

            $jobs = RepairServiceProposal::with([
                'carRepair.user',
                'service',
                'jobAssignments.mechanic'
            ])
                ->whereHas('jobAssignments', function ($query) use ($mechanicId) {
                    $query->where('mechanic_id', $mechanicId);
                })
                ->get()
                ->map(function ($job) {
                    return [
                        'id' => $job->id,
                        'service' => $job->service,
                        'carRepair' => $job->carRepair,
                        'status' => $job->status,
                        'notes' => $job->jobAssignments->first()?->notes,
                        'created_at' => $job->created_at,
                        'updated_at' => $job->updated_at
                    ];
                });

            return response()->json([
                'status' => 'success',
                'data' => $jobs
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching mechanic jobs: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch jobs',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateJobStatus(Request $request, $id)
    {
        try {
            $request->validate([
                'status' => 'required|in:proposed,approved,rejected,completed,complaint'
            ]);

            $job = RepairServiceProposal::findOrFail($id);

            // Pastikan job ini milik mekanik yang sedang login
            if (!$job->jobAssignments()->where('mechanic_id', Auth::id())->exists()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Anda tidak memiliki akses ke job ini'
                ], 403);
            }

            $job->update(['status' => $request->status]);

            return response()->json([
                'status' => 'success',
                'message' => 'Status job berhasil diperbarui'
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating job status: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memperbarui status job',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
