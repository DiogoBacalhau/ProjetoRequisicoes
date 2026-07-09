import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RequisicaoService, Requisicao } from '../../services/requisicao';

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

  constructor(private requisicaoService: RequisicaoService) {}

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

  getBadgeClass(estado: string | undefined): string {
    switch (estado?.toLowerCase()) {
      case 'pendente': return 'bg-warning text-dark';
      case 'aprovada': return 'bg-success text-white';
      case 'rejeitada': return 'bg-danger text-white';
      case 'cancelada': return 'bg-secondary text-white';
      default: return 'bg-light text-dark';
    }
  }
}