<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CarRepair;
use App\Models\RepairServiceProposal;
use App\Models\Service;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\JobAssignment;
use App\Models\ServiceProposal;

/**
 * Controller for handling car repair-related operations
 */
class CarRepairController extends Controller
{
    /**
     * Get all car repairs with their related data
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $carRepairs = CarRepair::with([
                'user',
                'proposals.service',
                'proposals.jobAssignment.mechanic'
            ])->get();

            return response()->json([
                'status' => 'success',
                'data' => $carRepairs
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch car repairs',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new car repair with service proposals
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'car_model' => 'required|string|max:255',
            'date_brought' => 'required|date',
            'proposals' => 'required|array',
            'proposals.*.service_id' => 'required|exists:services,id',
            'proposals.*.status' => 'required|in:proposed,approved,rejected,completed,complaint'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Create car repair
            $carRepair = CarRepair::create([
                'user_id' => $request->user_id,
                'car_model' => $request->car_model,
                'date_brought' => $request->date_brought,
                'status' => 'pending'
            ]);

            // Create proposals with services
            foreach ($request->proposals as $proposalData) {
                $proposal = $carRepair->proposals()->create([
                    'service_id' => $proposalData['service_id'],
                    'status' => $proposalData['status']
                ]);
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Car repair created successfully',
                'data' => $carRepair->load('proposals.service')
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create car repair',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the status of a service proposal
     *
     * @param Request $request
     * @param int $carRepairId
     * @param int $proposalId
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateProposalStatus(Request $request, $carRepairId, $proposalId)
    {
        try {
            $validator = Validator::make($request->all(), [
                'status' => 'required|in:proposed,approved,rejected,completed,complaint'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $proposal = RepairServiceProposal::where('car_repair_id', $carRepairId)
                ->where('id', $proposalId)
                ->firstOrFail();

            $proposal->update([
                'status' => $request->status
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Proposal status updated successfully',
                'data' => $proposal
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update proposal status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a car repair record
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'car_model' => 'required|string|max:255',
                'date_brought' => 'required|date',
                'status' => 'required|in:pending,in_progress,waiting_for_review,completed'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $carRepair = CarRepair::findOrFail($id);
            $carRepair->update([
                'car_model' => $request->car_model,
                'date_brought' => $request->date_brought,
                'status' => $request->status
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Car repair updated successfully',
                'data' => $carRepair->load('proposals.service')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update car repair',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a car repair and its related data
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            DB::beginTransaction();

            $carRepair = CarRepair::findOrFail($id);

            // Delete all related proposals
            $carRepair->proposals()->delete();

            // Delete all related complaints
            $carRepair->complaints()->delete();

            // Delete car repair
            $carRepair->delete();

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Car repair and related data deleted successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete car repair',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Add a new service to a car repair
     *
     * @param Request $request
     * @param int $carRepairId
     * @return \Illuminate\Http\JsonResponse
     */
    public function addService(Request $request, $carRepairId)
    {
        try {
            $validator = Validator::make($request->all(), [
                'service_id' => 'required|exists:services,id',
                'status' => 'required|in:proposed,approved,rejected,completed,complaint'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $carRepair = CarRepair::findOrFail($carRepairId);

            $proposal = $carRepair->proposals()->create([
                'service_id' => $request->service_id,
                'status' => $request->status
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Service added successfully',
                'data' => $proposal->load('service')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to add service',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all available services
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getServices()
    {
        try {
            $services = Service::all();

            return response()->json([
                'status' => 'success',
                'data' => $services
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch services',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all available mechanics
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getMechanics()
    {
        try {
            // Ambil user dengan role mechanic
            $mechanics = User::where('role', 'mechanic')->get();

            return response()->json([
                'status' => 'success',
                'data' => $mechanics
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch mechanics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Assign a mechanic to a car repair
     *
     * @param Request $request
     * @param int $carRepairId
     * @return \Illuminate\Http\JsonResponse
     */
    public function assignMechanic(Request $request, $carRepairId)
    {
        try {
            $validator = Validator::make($request->all(), [
                'mechanic_id' => 'required|exists:users,id',
                'service_proposal_id' => 'required|exists:repair_service_proposals,id',
                'notes' => 'nullable|string|max:500'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $serviceProposal = RepairServiceProposal::where('car_repair_id', $carRepairId)
                ->where('id', $request->service_proposal_id)
                ->firstOrFail();

            DB::beginTransaction();
            try {
                // Cek apakah sudah ada job assignment
                if ($serviceProposal->jobAssignment) {
                    // Update job assignment yang ada
                    $serviceProposal->jobAssignment->update([
                        'mechanic_id' => $request->mechanic_id,
                        'notes' => $request->notes
                    ]);
                    $jobAssignment = $serviceProposal->jobAssignment;
                } else {
                    // Buat job assignment baru
                    $jobAssignment = new JobAssignment([
                        'mechanic_id' => $request->mechanic_id,
                        'notes' => $request->notes
                    ]);
                    $serviceProposal->jobAssignment()->save($jobAssignment);
                }

                DB::commit();

                return response()->json([
                    'status' => 'success',
                    'message' => 'Mechanic assigned successfully',
                    'data' => $jobAssignment->load(['mechanic', 'repairServiceProposal.service'])
                ]);
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to assign mechanic',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a service from a car repair
     *
     * @param CarRepair $carRepair
     * @param int $service
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteService(CarRepair $carRepair, $service)
    {
        try {
            $serviceProposal = RepairServiceProposal::findOrFail($service);

            // Pastikan service ini milik car repair yang dimaksud
            if ($serviceProposal->car_repair_id !== $carRepair->id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Service tidak ditemukan pada perbaikan mobil ini'
                ], 404);
            }

            // Hapus service proposal
            $serviceProposal->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Service berhasil dihapus'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menghapus service',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get cars owned by the authenticated user
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getMyCars(Request $request)
    {
        try {
            $user = $request->user();

            $carRepairs = CarRepair::with([
                'proposals.service',
                'proposals.jobAssignment.mechanic',
                'proposals' => function ($query) {
                    $query->orderBy('created_at', 'desc');
                }
            ])
                ->where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $carRepairs
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch car repairs',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get service history for a car
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getServiceHistory(Request $request)
    {
        try {
            $user = $request->user();

            $carRepairs = CarRepair::with([
                'proposals.service',
                'proposals.jobAssignment.mechanic',
                'proposals' => function ($query) {
                    $query->where('status', 'completed')
                        ->orderBy('created_at', 'desc');
                }
            ])
                ->where('user_id', $user->id)
                ->whereHas('proposals', function ($query) {
                    $query->where('status', 'completed');
                })
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $carRepairs
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch service history',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
