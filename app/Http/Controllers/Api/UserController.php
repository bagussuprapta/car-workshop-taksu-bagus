<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

/**
 * Controller for handling user-related operations
 */
class UserController extends Controller
{
    /**
     * Get all users with their basic information
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $users = User::select('id', 'name', 'email', 'role')->get();

            return response()->json([
                'status' => 'success',
                'data' => $users
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch user data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update user role
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateRole(Request $request, $id)
    {
        try {
            Log::info('Update role request:', [
                'user_id' => $id,
                'request_data' => $request->all(),
                'request_body' => $request->getContent(),
                'request_method' => $request->method(),
                'request_headers' => $request->headers->all()
            ]);

            $user = User::findOrFail($id);

            $validRoles = ['admin', 'car_owner', 'mechanic'];

            // Debug role yang diterima
            Log::info('Role validation:', [
                'received_role' => $request->role,
                'valid_roles' => $validRoles,
                'is_valid' => in_array($request->role, $validRoles)
            ]);

            $request->validate([
                'role' => [
                    'required',
                    'string',
                    function ($attribute, $value, $fail) use ($validRoles) {
                        if (!in_array($value, $validRoles)) {
                            $fail('Selected role is invalid. Available roles: ' . implode(', ', $validRoles));
                        }
                    }
                ]
            ]);

            Log::info('Updating user role:', [
                'user_id' => $user->id,
                'old_role' => $user->role,
                'new_role' => $request->role
            ]);

            $user->role = $request->role;
            $user->save();

            Log::info('Role updated successfully');

            return response()->json([
                'status' => 'success',
                'message' => 'Role updated successfully',
                'data' => $user
            ]);
        } catch (\InvalidArgumentException $e) {
            Log::error('Invalid role error:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid role',
                'error' => $e->getMessage()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Update role error:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update user role',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all users with car owner role
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCarOwners()
    {
        try {
            $carOwners = User::where('role', 'car_owner')
                ->select('id', 'name', 'email')
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $carOwners
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch car owners',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
