<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Requisicao;

class GestaoRequisicaoController extends Controller
{
    public function index()
    {
        //Permite definir como concluida apos o prazo definido ser ultrapassado
        Requisicao::where('estado', 'aprovada')
            ->where('data_fim', '<', now())
            ->update(['estado' => 'concluida']);
    
        return Requisicao::with(['recurso', 'user'])->get();
    }

    public function store(Request $request)
    {
        if (!auth()->check()) return response()->json(['message' => 'Não autenticado.'], 401);

        $dadosValidados = $request->validate([
            'recurso_id'  => 'required|exists:recursos,id',
            'data_inicio' => 'required|date|after_or_equal:now',
            'data_fim'    => 'required|date|after:data_inicio',
            'observacoes' => 'nullable|string',
        ],[
            'data_inicio.after_or_equal' => 'A data de início deve ser igual ou superior à data atual.',
            'data_fim.after'             => 'A data de fim deve ser posterior à data de início.',
            'recurso_id.exists'          => 'O recurso selecionado não é válido.',
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
            return response()->json(['message' => 'O recurso já se encontra reservado.'], 422);
        }

        $requisicao = Requisicao::create($dadosValidados);
        return response()->json($requisicao, 201);
    }

    public function cancelar($id)
    {
        $userLogado = auth()->user();
        $requisicao = Requisicao::find($id);

        if (!$requisicao) return response()->json(['message' => 'Requisição não encontrada'], 404);
    
        //Somente o dono da requisição pode cancelar
        if ($requisicao->user_id !== $userLogado->id && $userLogado->role !== 'admin') {
            return response()->json(['message' => 'Sem permissão.'], 403);
        }
    
        //Só permite cancelar o que está pendente
        if ($requisicao->estado !== 'pendente' && $requisicao->estado !== 'aprovada') {
            return response()->json(['message' => 'Apenas requisições pendentes ou aprovadas podem ser canceladas.'], 400);
        }
    
        $requisicao->update(['estado' => 'cancelada']);
        return response()->json(['message' => 'Requisição cancelada com sucesso.'], 200);
    }

    public function analisar(Request $request, $id)
    {
        $userLogado = auth()->user();

        if (!$userLogado || $userLogado->role !== 'admin') {
            return response()->json(['message' => 'Acesso negado.'], 403);
        }

        $requisicao = Requisicao::find($id);
        if (!$requisicao) return response()->json(['message' => 'Não encontrada'], 404);

        $dadosValidados = $request->validate([
            'estado'      => 'required|in:pendente,aprovada,rejeitada,concluida,cancelada',
            'observacoes' => 'nullable|string'
        ]);

        $requisicao->update($dadosValidados);
        return response()->json($requisicao, 200);
    }
}