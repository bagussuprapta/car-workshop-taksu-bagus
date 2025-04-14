<?php

use App\Http\Controllers\Api\DiagramController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/diagram/smd', [DiagramController::class, 'smdDiagram']);
Route::get('/diagram/erd', [DiagramController::class, 'erdDiagram']);
