<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('requisicoes', function (Blueprint $table) {
            $table->id();
            //FK -> Ligações com as restantes tabelas
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('recurso_id')->constrained('recursos')->onDelete('cascade');
            //Datas das reservas -> 5. Regras de Negócio
            $table->dateTime('data_inicio');
            $table->dateTime('data_fim');
            //Enumerador para o estado das requisições
            $table->enum('estado', ['pendente', 'aprovada', 'rejeitada', 'concluida', 'cancelada'])->default('pendente');
            //Observações para o admin explicar a razão da aprovação/rejeição
            $table->text('observacoes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('requisicoes');
    }
};
