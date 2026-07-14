import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RequisicaoService, Requisicao } from '../../services/requisicao';
import { AuthService } from '../../services/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-requisicao-lista',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './requisicao-lista.html',
  styleUrls: ['./requisicao-lista.css']
})
export class RequisicaoLista implements OnInit {
  requisicoes = signal<Requisicao[]>([]);
  erroMensagem = signal<string>('');

  constructor(
    private requisicaoService: RequisicaoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.carregarRequisicoes();
  }

  carregarRequisicoes(): void {
    this.requisicaoService.getRequisicoes().subscribe({
      next: (dados) => this.requisicoes.set(dados),
      error: (err) => {
        console.error('Erro ao carregar requisições', err);
        this.erroMensagem.set('Não foi possível carregar a lista.');
      }
    });
  }

  analisarEstado(id: number, novoEstado: string): void {
    const mensagem = novoEstado === 'cancelada' 
      ? 'Tens a certeza que queres cancelar esta requisição?' 
      : `Tens a certeza que queres alterar para "${novoEstado}"?`;

    if (confirm(mensagem)) {
      let acao$: Observable<any>;

      if (novoEstado === 'cancelada') {
        acao$ = this.requisicaoService.cancelarRequisicao(id);
      } else {
        acao$ = this.requisicaoService.atualizarEstado(id, novoEstado);
      }

      acao$.subscribe({
        next: () => this.carregarRequisicoes(),
        error: (err) => {
          console.error('Erro ao processar ação', err);
          this.erroMensagem.set(err.error?.message || 'Erro ao processar ação.');
        }
      });
    }
  }

  isAdmin(): boolean {
    return this.authService.getRole() === 'admin';
  }

  getUserIdLogado(): number | null {
    const user = this.authService.currentUser();
    return user ? user.id : null;
  }

  getBadgeClass(estado: string | undefined): string {
    switch (estado?.toLowerCase()) {
      case 'pendente': return 'bg-pendente';
      case 'aprovada': return 'bg-aprovada';
      case 'rejeitada': return 'bg-rejeitada';
      case 'concluida': return 'bg-concluida';
      case 'cancelada': return 'bg-cancelada';
      default: return 'bg-secondary';
    }
  }
}