<?php

use App\Http\Controllers\Api\DiagramController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CarRepairController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\MechanicController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('jwt.auth')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
    });
});

Route::get('/diagram/smd', [DiagramController::class, 'smdDiagram']);
Route::get('/diagram/erd', [DiagramController::class, 'erdDiagram']);

// Car Repair Routes
Route::middleware('jwt.auth')->group(function () {
    Route::get('/car-repairs', [CarRepairController::class, 'index']);
    Route::post('/car-repairs', [CarRepairController::class, 'store']);
    Route::put('/car-repairs/{carRepair}', [CarRepairController::class, 'update']);
    Route::delete('/car-repairs/{carRepair}', [CarRepairController::class, 'destroy']);
    Route::put('/car-repairs/{carRepair}/proposals/{proposal}/status', [CarRepairController::class, 'updateProposalStatus']);
    Route::post('/car-repairs/{carRepair}/services', [CarRepairController::class, 'addService']);
    Route::delete('/car-repairs/{carRepair}/services/{service}', [CarRepairController::class, 'deleteService']);
    Route::get('/services', [CarRepairController::class, 'getServices']);

    // Job Assignment Routes
    Route::post('/car-repairs/{carRepair}/assign', [CarRepairController::class, 'assignMechanic']);
    Route::get('/mechanics', [CarRepairController::class, 'getMechanics']);

    // User Management Routes
    Route::get('/users', [UserController::class, 'index']);
    Route::put('/users/{user}/role', [UserController::class, 'updateRole']);
    Route::get('/users/car-owners', [UserController::class, 'getCarOwners']);

    // New route
    Route::get('/car-repairs/my-cars', [CarRepairController::class, 'getMyCars']);
    Route::get('/car-repairs/service-history', [CarRepairController::class, 'getServiceHistory']);
});

// Service Routes
Route::middleware('auth:api')->group(function () {
    Route::get('/services', [ServiceController::class, 'index']);
    Route::post('/services', [ServiceController::class, 'store']);
    Route::get('/services/{id}', [ServiceController::class, 'show']);
    Route::put('/services/{id}', [ServiceController::class, 'update']);
    Route::delete('/services/{id}', [ServiceController::class, 'destroy']);
});

// Mechanic Routes
Route::middleware('jwt.auth')->group(function () {
    Route::get('/mechanic/jobs', [MechanicController::class, 'getJobs']);
    Route::put('/mechanic/jobs/{id}/status', [MechanicController::class, 'updateJobStatus']);
});
