<?php

namespace Tests\Feature;

use App\Models\Recurso;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GestaoRecursosApiTest extends TestCase
{
    //Garante que a base de dados de testes é limpa e migrada a cada teste corrido
    use RefreshDatabase;

    //Responsável por criar um recurso
    public function test_pode_criar_um_recurso_com_dados_validos(): void
    {
        $dados = [
            'nome' => 'Sala de Reuniões Alfa',
            'tipo' => 'espaco',
            'descricao' => 'Sala com projetor e capacidade para 10 pessoas.'
        ];

        //Pedido HTTP POST
        $response = $this->postJson('/api/recursos', $dados);

        //Ve se devolve o JSON corretamente e com codigo 201
        $response->assertStatus(201)
                 ->assertJsonFragment(['nome' => 'Sala de Reuniões Alfa']);

        //Verifica se foi adicionado na BD
        $this->assertDatabaseHas('recursos', [
            'nome' => 'Sala de Reuniões Alfa',
            'status' => true
        ]);
    }

    
    //Responsável por mostrar todos os recursos.
    public function test_mostra_todos_os_recursos(): void
    {
        //Recursos falsos para teste
        Recurso::create(['nome' => 'Recurso A', 'tipo' => 'equipamentos']);
        Recurso::create(['nome' => 'Recurso B', 'tipo' => 'viaturas']);

        //Pedido HTTP GET
        $response = $this->getJson('/api/recursos');

        $response->assertStatus(200)
                 ->assertJsonCount(2);
    }

    //Ativar/Desativar um recurso
    public function test_pode_desativar_um_recurso_via_patch(): void
    {
        //Cria um recurso que por default está ativo
        $recurso = Recurso::create([
            'nome' => 'Carrinha de Carga',
            'tipo' => 'viaturas',
            'status' => true
        ]);

        //Faz um pedido PATCH para alterar apenas o status para false
        $response = $this->patchJson("/api/recursos/{$recurso->id}", [
            'status' => false
        ]);

        $response->assertStatus(200);

        //Confirma que status na BD ficou false
        $this->assertDatabaseHas('recursos', [
            'id' => $recurso->id,
            'status' => false
        ]);
    }
}