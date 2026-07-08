<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recurso extends Model
{
    use HasFactory;

    //Apenas por proteção
    protected $table = 'recursos';

    //Atributos autorizados para preenchimento dos campos
    protected $fillable = [
        'nome',
        'tipo',
        'descricao',
        'status',
    ];

    //Para garantir que o status é sempre booleano em status
    protected $casts = [
        'status' => 'boolean',
    ];
}