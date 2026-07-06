<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GestaoRecursosController;


//Padrão do Laravel
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//Endpoints relativos aos recursos

//Mostrar todos os recursos
Route::get('/recursos', [GestaoRecursosController::class, 'index']);

//Criar um novo recurso
Route::post('/recursos', [GestaoRecursosController::class, 'store']);

//Mostrar detalhes de um determinado recurso
Route::get('/recursos/{id}', [GestaoRecursosController::class, 'show']);

//Atualizar dados | Ativar/Desativar recurso
Route::patch('/recursos/{id}', [GestaoRecursosController::class, 'update']);
Route::put('/recursos/{id}', [GestaoRecursosController::class, 'update']);

//Remover um recurso
Route::delete('/recursos/{id}', [GestaoRecursosController::class, 'destroy']);