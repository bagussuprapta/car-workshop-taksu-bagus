<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * Controller for handling service-related operations
 */
class ServiceController extends Controller
{
    /**
     * Get all services
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $services = Service::all();
            return response()->json([
                'status' => 'success',
                'data' => $services
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch services:', [
                'error' => $e->getMessage()
            ]);
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch services',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new service
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'price' => 'required|numeric|min:0'
            ]);

            $service = Service::create($request->all());

            return response()->json([
                'status' => 'success',
                'message' => 'Service added successfully',
                'data' => $service
            ], 201);
        } catch (\Exception $e) {
            Log::error('Failed to create service:', [
                'error' => $e->getMessage(),
                'request' => $request->all()
            ]);
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to add service',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific service by ID
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            $service = Service::findOrFail($id);
            return response()->json([
                'status' => 'success',
                'data' => $service
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch service:', [
                'error' => $e->getMessage(),
                'service_id' => $id
            ]);
            return response()->json([
                'status' => 'error',
                'message' => 'Service not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update a specific service
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        try {
            $service = Service::findOrFail($id);

            $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'price' => 'sometimes|required|numeric|min:0'
            ]);

            $service->update($request->all());

            return response()->json([
                'status' => 'success',
                'message' => 'Service updated successfully',
                'data' => $service
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to update service:', [
                'error' => $e->getMessage(),
                'service_id' => $id,
                'request' => $request->all()
            ]);
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update service',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a specific service
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $service = Service::findOrFail($id);
            $service->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Service deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to delete service:', [
                'error' => $e->getMessage(),
                'service_id' => $id
            ]);
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete service',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
