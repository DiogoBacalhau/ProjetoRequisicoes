<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Requisicao;

class GestaoRequisicaoController extends Controller
{
    public function index()
    {
        Requisicao::where('estado', 'aprovada')
            ->where('data_fim', '<', now())
            ->update(['estado' => 'concluida']);

        $requisicoes = Requisicao::with(['recurso', 'user'])->get();
        return response()->json($requisicoes, 200);
    }

    public function store(Request $request)
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Não autenticado.'], 401);
        }

        $dadosValidados = $request->validate([
            'recurso_id'  => 'required|exists:recursos,id',
            'data_inicio' => 'required|date|after_or_equal:now',
            'data_fim'    => 'required|date|after:data_inicio',
            'observacoes' => 'nullable|string',
        ]);

        $dadosValidados['user_id'] = auth()->id();

        $sobreposicao = Requisicao::where('recurso_id', $request->recurso_id)
            ->whereIn('estado', ['pendente', 'aprovada'])
            ->where(function ($query) use ($request) {
                $query->where('data_inicio', '<', $request->data_fim)
                      ->where('data_fim', '>', $request->data_inicio);
            })
            ->exists();

        if ($sobreposicao) {
            return response()->json([
                'message' => 'O recurso já se encontra reservado ou pendente de aprovação neste intervalo de horário.'
            ], 422);
        }

        $requisicao = Requisicao::create($dadosValidados);
        return response()->json($requisicao, 201);
    }

    public function cancelar($id)
    {
        $userLogado = auth()->user();
        if (!$userLogado) {
            return response()->json(['message' => 'Não autenticado.'], 401);
        }

        $requisicao = Requisicao::find($id);
        if (!$requisicao) {
            return response()->json(['message' => 'Requisição não encontrada'], 404);
        }

        if ($requisicao->user_id !== $userLogado->id && $userLogado->role !== 'administrador') {
            return response()->json(['message' => 'Não tem permissão para cancelar esta requisição.'], 403);
        }

        if (in_array($requisicao->estado, ['rejeitada', 'concluida', 'cancelada'])) {
            return response()->json(['message' => 'Esta requisição já não pode ser cancelada.'], 400);
        }

        $requisicao->update(['estado' => 'cancelada']);
        return response()->json($requisicao, 200);
    }

    public function analisar(Request $request, $id)
    {
        $userLogado = auth()->user();

        if (!$userLogado || $userLogado->role !== 'admin') {
            return response()->json(['message' => 'Acesso negado. Apenas administradores podem alterar o estado.'], 403);
        }

        $requisicao = Requisicao::find($id);
        if (!$requisicao) {
            return response()->json(['message' => 'Requisição não encontrada'], 404);
        }

        $dadosValidados = $request->validate([
            'estado'      => 'required|in:pendente,aprovada,rejeitada,concluida,cancelada',
            'observacoes' => 'nullable|string'
        ]);

        $requisicao->update($dadosValidados);
        return response()->json($requisicao, 200);
    }
}