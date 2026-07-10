import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RequisicaoService, Requisicao } from '../../services/requisicao';
import { AuthService } from '../../services/auth';

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
      next: (dados) => {
        this.requisicoes.set(dados);
      },
      error: (err) => {
        console.error('Erro ao carregar requisições', err);
        this.erroMensagem.set('Não foi possível carregar a lista de requisições.');
      }
    });
  }

  analisarEstado(id: number, novoEstado: string): void {
    const mensagemConfirmacao = novoEstado === 'cancelada' 
      ? 'Tem a certeza que deseja cancelar a sua requisição?' 
      : `Tem a certeza que deseja alterar o estado desta requisição para "${novoEstado}"?`;

    if (confirm(mensagemConfirmacao)) {
      
      const acao$ = novoEstado === 'cancelada'
        ? this.requisicaoService.cancelarRequisicao(id)
        : this.requisicaoService.atualizarEstado(id, novoEstado);

      acao$.subscribe({
        next: () => {
          this.carregarRequisicoes();
        },
        error: (err) => {
          console.error('Erro ao atualizar estado', err);
          this.erroMensagem.set('Não foi possível atualizar o estado da requisição. Tenta novamente.');
        }
      });
    }
  }

  isAdmin(): boolean {
    const role = this.authService.getRole();
    return role === 'admin';
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
      case 'concluída':
      case 'concluida': return 'bg-concluida';
      case 'cancelada': return 'bg-cancelada';
      default: return 'bg-secondary';
    }
  }
}