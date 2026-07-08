import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Recurso {
  id?: number;
  nome: string;
  tipo: 'espaco' | 'equipamentos' | 'viaturas' | 'outros ativos organizacionais';
  descricao?: string; //campo opcioanl
  status: boolean | number;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecursoService {
  private apiUrl = 'http://localhost:8000/api/recursos';

  constructor(private http: HttpClient) { }

  getRecursos(): Observable<Recurso[]> {
    return this.http.get<Recurso[]>(this.apiUrl);
  }

  getRecurso(id: number): Observable<Recurso> {
    return this.http.get<Recurso>(`${this.apiUrl}/${id}`);
  }

  createRecurso(recurso: Recurso): Observable<Recurso> {
    return this.http.post<Recurso>(this.apiUrl, recurso);
  }

  updateRecurso(id: number, recurso: Recurso): Observable<Recurso> {
    return this.http.patch<Recurso>(`${this.apiUrl}/${id}`, recurso);
  }

  deleteRecurso(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}