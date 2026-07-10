import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'colaborador';
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';

  currentUser = signal<AuthResponse['user'] | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
    this.carregarSessao();
  }

  login(credenciais: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credenciais).pipe(
      tap(resposta => {
        localStorage.setItem('token', resposta.access_token);
        localStorage.setItem('user', JSON.stringify(resposta.user));
        
        this.currentUser.set(resposta.user);
        this.isAuthenticated.set(true);
      })
    );
  }

  registar(dadosUtilizador: { name: string; email: string; password: string; role: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, dadosUtilizador);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap({
        next: () => this.limparSessao(),
        error: () => this.limparSessao()
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    const utilizador = this.currentUser();
    return utilizador ? utilizador.role : null;
  }

  private carregarSessao(): void {
    const token = this.getToken();
    const userJson = localStorage.getItem('user');

    if (token && userJson) {
      try {
        this.currentUser.set(JSON.parse(userJson));
        this.isAuthenticated.set(true);
      } catch (e) {
        this.limparSessao();
      }
    }
  }

  limparSessao(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }
}