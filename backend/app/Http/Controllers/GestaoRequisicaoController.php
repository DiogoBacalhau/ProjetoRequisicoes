<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Requisicao;

class GestaoRequisicaoController extends Controller
{
    public function index()
    {
        $requisicoes = Requisicao::with(['recurso', 'user'])->get();
        return response()->json($requisicoes, 200);
    }

    public function store(Request $request)
    {
        $dadosValidados = $request->validate([
            'user_id'     => 'required|exists:users,id',
            'recurso_id'  => 'required|exists:recursos,id',
            'data_inicio' => 'required|date|after_or_equal:now',
            'data_fim'    => 'required|date|after:data_inicio',
            'observacoes' => 'nullable|string',
        ]);

        $requisicao = Requisicao::create($dadosValidados);

        return response()->json($requisicao, 201);
    }

    public function cancelar($id)
    {
        $requisicao = Requisicao::find($id);

        if (!$requisicao) {
            return response()->json(['message' => 'Requisição não encontrada'], 404);
        }

        if (in_array($requisicao->estado, ['rejeitada', 'concluida', 'cancelada'])) {
            return response()->json(['message' => 'Esta requisição já não pode ser cancelada.'], 400);
        }

        $requisicao->update(['estado' => 'cancelada']);
        return response()->json($requisicao, 200);
    }

    public function analisar(Request $request, $id)
    {
        $requisicao = Requisicao::find($id);

        if (!$requisicao) {
            return response()->json(['message' => 'Requisição não encontrada'], 404);
        }

        $dadosValidados = $request->validate([
            'estado'      => 'required|in:aprovada,rejeitada',
            'observacoes' => 'nullable|string'
        ]);

        $requisicao->update($dadosValidados);
        return response()->json($requisicao, 200);
    }
}