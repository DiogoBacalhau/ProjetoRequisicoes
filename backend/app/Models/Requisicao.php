<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Requisicao extends Model
{
    use HasFactory;

    protected $table = 'requisicoes';

    protected $fillable = [
        'user_id',
        'recurso_id',
        'data_inicio',
        'data_fim',
        'estado',
        'observacoes',
    ];

    protected $casts = [
        'data_inicio' => 'datetime',
        'data_fim' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function recurso()
    {
        return $this->belongsTo(Recurso::class, 'recurso_id');
    }
}