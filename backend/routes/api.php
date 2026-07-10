<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GestaoRecursosController;
use App\Http\Controllers\GestaoRequisicaoController;
use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/recursos', [GestaoRecursosController::class, 'index']);
    Route::get('/recursos/{id}', [GestaoRecursosController::class, 'show']);
    Route::get('/requisicoes', [GestaoRequisicaoController::class, 'index']);
    Route::post('/requisicoes', [GestaoRequisicaoController::class, 'store']);
    Route::patch('/requisicoes/{id}/cancelar', [GestaoRequisicaoController::class, 'cancelar']);
    Route::patch('/requisicoes/{id}/analisar', [GestaoRequisicaoController::class, 'analisar']);

    Route::middleware('admin.verificar')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/recursos', [GestaoRecursosController::class, 'store']);
        Route::patch('/recursos/{id}', [GestaoRecursosController::class, 'update']);
        Route::put('/recursos/{id}', [GestaoRecursosController::class, 'update']);
        Route::delete('/recursos/{id}', [GestaoRecursosController::class, 'destroy']);
    });
});