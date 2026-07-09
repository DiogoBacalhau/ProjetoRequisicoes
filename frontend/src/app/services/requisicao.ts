import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recurso } from './recurso';

export interface Requisicao {
  id?: number;
  user_id: number;
  recurso_id: number;
  data_inicio: string;
  data_fim: string;
  estado?: 'pendente' | 'aprovada' | 'rejeitada' | 'concluida' | 'cancelada';
  observacoes?: string;
  created_at?: string;
  updated_at?: string;
  recurso?: Recurso;
  user?: { id: number; name: string; email: string };
}

@Injectable({
  providedIn: 'root'
})
export class RequisicaoService {
  private apiUrl = 'http://localhost:8000/api/requisicoes';

  constructor(private http: HttpClient) {}

  //Obtem todas as requisições
  getRequisicoes(): Observable<Requisicao[]> {
    return this.http.get<Requisicao[]>(this.apiUrl);
  }

  //Cria uma nova requisição
  createRequisicao(requisicao: Requisicao): Observable<Requisicao> {
    return this.http.post<Requisicao>(this.apiUrl, requisicao);
  }

  //O user cancela uma requisição (apenas a dele)
  cancelarRequisicao(id: number): Observable<Requisicao> {
    return this.http.patch<Requisicao>(`${this.apiUrl}/${id}/cancelar`, {});
  }

  //Admin aprova/rejeita a requisição
  analisarRequisicao(id: number, dados: { estado: 'aprovada' | 'rejeitada', observacoes?: string }): Observable<Requisicao> {
    return this.http.patch<Requisicao>(`${this.apiUrl}/${id}/analisar`, dados);
  }
}