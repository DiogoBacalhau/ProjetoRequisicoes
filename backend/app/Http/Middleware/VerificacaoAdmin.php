<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerificacaoAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        //Se o utilizador não estiver autenticado ou não for um admin, devolve Erro 403 (Proibído)
        if (!auth()->check() || auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Acesso negado. Apenas admins.'], 403);
        }

        return $next($request);
    }
}