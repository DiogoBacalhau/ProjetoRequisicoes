<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Recurso;

class GestaoRecursosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //Vai à bd buscar todos os recursos
        $recursos = Recurso::all();

        //Devovle em JSON a lista com o status HTTP 200 (OK)
        return response()->json($recursos, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //Validação dos dados recebidos
        $dadosValidados = $request->validate([
            'nome' => 'required | string | max:255',
            'tipo' => 'required | in:espaco, equipamentos, viaturas, outros ativos organizacionais',
            'descricao' => 'nullable | string',
        ]);

        //Como está definido na tabela default(true) não precisamos de mandar 'status'
        $recurso = Recurso::create($dadosValidados);

        return response()->json($recurso, 201); //Created
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $recurso = Recurso::find($id);

        if (!$recurso) {
            return response()->json(['message' => 'Recurso não encontrado'], 404);
        }

        return response()->json($recurso, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $recurso = Recurso::find($id);

        if (!$recurso) {
            return response()->json(['message' => 'Recurso não encontrado'], 404); //NOT FOUND
        }

        //Validamos apenas o que vier na requisição -> no endpoint uso PATCH
        $dadosValidados = $request->validate([
            'nome'      => 'sometimes | string | max:255',
            'tipo'      => 'sometimes | in:espaco, equipamentos, viaturas, outros ativos organizacionais',
            'descricao' => 'nullable | string',
            'status'    => 'sometimes | boolean' //sometimes -> só veririca o que está no campo se for pedido, se não for pedido ignora
        ]);

        $recurso->update($dadosValidados);

        return response()->json($recurso, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //Procura o recurso
        $recurso = Recurso::find($id);

        if (!$recurso) {
            return response()->json(['message' => 'Recurso não encontrado'], 404);
        }

        //Elimina o recurso que selecionou
        $recurso->delete();

        return response()->json(['message' => 'Recurso eliminado com sucesso'], 200);
    }
}
