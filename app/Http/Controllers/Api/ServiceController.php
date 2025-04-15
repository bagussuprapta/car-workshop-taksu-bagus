<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ServiceController extends Controller
{
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
                'message' => 'Gagal mengambil data services',
                'error' => $e->getMessage()
            ], 500);
        }
    }

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
                'message' => 'Service berhasil ditambahkan',
                'data' => $service
            ], 201);
        } catch (\Exception $e) {
            Log::error('Failed to create service:', [
                'error' => $e->getMessage(),
                'request' => $request->all()
            ]);
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menambahkan service',
                'error' => $e->getMessage()
            ], 500);
        }
    }

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
                'message' => 'Service tidak ditemukan',
                'error' => $e->getMessage()
            ], 404);
        }
    }

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
                'message' => 'Service berhasil diupdate',
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
                'message' => 'Gagal mengupdate service',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $service = Service::findOrFail($id);
            $service->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Service berhasil dihapus'
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to delete service:', [
                'error' => $e->getMessage(),
                'service_id' => $id
            ]);
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menghapus service',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
