<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RequisicaoController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validação dos dados recebidos
        $dadosValidados = $request->validate([
            'user_id'     => 'required|exists:users,id',
            'recurso_id'  => 'required|exists:recursos,id',
            'data_inicio' => 'required|date|after_or_equal:now',
            'data_fim'    => 'required|date|after:data_inicio',
            'observacoes' => 'nullable|string',
        ]);

        // Cria a requisição (o 'estado' assume automaticamente 'pendente' via BD)
        $requisicao = Requisicao::create($dadosValidados);

        // Devolve a requisição criada com o status 201 (Created)
        return response()->json($requisicao, 201);
    }
}
