<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GestaoRecursosController;
use App\Http\Controllers\GestaoRequisicaoController;
use App\Http\Controllers\AuthController;

//Rota pública de acesso -> não precisa de autenticação
Route::post('/login', [AuthController::class, 'login']);

//Rotas que precisam de autenticação -> contas ativas
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);

    //GET Recursos -> utilizadores autenticados
    Route::get('/recursos', [GestaoRecursosController::class, 'index']);
    Route::get('/recursos/{id}', [GestaoRecursosController::class, 'show']);

    //POST Recursos -> utilizadores autenticados
    Route::post('/recursos', [GestaoRecursosController::class, 'store']);

    //CRUD Requisições -> utilizadores autenticados
    Route::get('/requisicoes', [GestaoRequisicaoController::class, 'index']);
    Route::post('/requisicoes', [GestaoRequisicaoController::class, 'store']);
    Route::patch('/requisicoes/{id}/cancelar', [GestaoRequisicaoController::class, 'cancelar']);

    //Rotas protegidas -> apenas admins
    //Uso de middleware para verificar se um determinado utilizador é admin
    Route::middleware('admin.verificar')->group(function () {
        
        //CRUD geral

        Route::post('/register', [AuthController::class, 'register']);
        
        Route::patch('/recursos/{id}', [GestaoRecursosController::class, 'update']);
        Route::put('/recursos/{id}', [GestaoRecursosController::class, 'update']);
        Route::delete('/recursos/{id}', [GestaoRecursosController::class, 'destroy']);
        
        Route::patch('/requisicoes/{id}/analisar', [GestaoRequisicaoController::class, 'analisar']);
    });
});