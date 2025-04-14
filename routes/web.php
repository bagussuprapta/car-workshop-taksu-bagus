<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PlantUmlController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/diagram/smd', [PlantUmlController::class, 'smdDiagram']);
Route::get('/diagram/erd', [PlantUmlController::class, 'erdDiagram']);
