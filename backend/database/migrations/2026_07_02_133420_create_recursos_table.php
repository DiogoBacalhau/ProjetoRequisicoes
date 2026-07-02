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
        Schema::create('recursos', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            //ENumerador para o tipo de recurso disponível
            $table->enum('tipo', ['espaco', 'equipamentos', 'viaturas', 'outros ativos organizacionais']);
            $table->text('descricao')->nullable();
            //Verifica se o recurso está ou não ativo -> 5. Regras de Negócio
            $table->boolean('status')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recursos');
    }
};
