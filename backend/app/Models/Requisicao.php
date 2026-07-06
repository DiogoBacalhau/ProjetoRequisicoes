<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Requisicao extends Model
{
    use HasFactory;

    // Força o nome correto da tabela em português
    protected $table = 'requisicoes';

    // Atributos autorizados para preenchimento em massa
    protected $fillable = [
        'user_id',
        'recurso_id',
        'data_inicio',
        'data_fim',
        'estado',
        'observacoes',
    ];

    // Garante que as datas vêm como objetos datetime prontos a usar no PHP
    protected $casts = [
        'data_inicio' => 'datetime',
        'data_fim' => 'datetime',
    ];
}