import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Requisicao {
  id: number;
  user_id: number;
  recurso_id: number;
  data_inicio: string;
  data_fim: string;
  estado: string;
  observacoes?: string;
  recurso?: { nome: string };
  user?: { name: string };
}

@Injectable({
  providedIn: 'root'
})
export class RequisicaoService {
  private apiUrl = 'http://localhost:8000/api/requisicoes';

  constructor(private http: HttpClient) {}

  getRequisicoes(): Observable<Requisicao[]> {
    return this.http.get<Requisicao[]>(this.apiUrl, { 
      withCredentials: true 
    });
  }

  createRequisicao(requisicao: Partial<Requisicao>): Observable<Requisicao> {
    return this.http.post<Requisicao>(this.apiUrl, requisicao, { 
      withCredentials: true 
    });
  }

  cancelarRequisicao(id: number): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/${id}/cancelar`, 
      {},
      { 
        withCredentials: true 
      }
    );
  }

  atualizarEstado(id: number, estado: string): Observable<Requisicao> {
    return this.http.patch<Requisicao>(
      `${this.apiUrl}/${id}/analisar`, 
      { 
        estado 
      },
      { 
        withCredentials: true 
      }
    );
  }
}