import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RequisicaoService } from '../../services/requisicao';
import { RecursoService, Recurso } from '../../services/recurso';

interface DadosFormRequisicao {
  recurso_id: number;
  data_inicio: string;
  data_fim: string;
  observacoes: string;
}

@Component({
  selector: 'app-requisicao-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './requisicao-form.html',
})
export class RequisicaoForm implements OnInit {
  //Sinal usado para mostrar os recursos que estão disponíveis no momento
  recursosDisponiveis = signal<Recurso[]>([]);
  
  requisicao: DadosFormRequisicao = {
    recurso_id: 0,
    data_inicio: '',
    data_fim: '',
    observacoes: ''
  };

  erroMensagem = signal<string>('');

  constructor(
    private requisicaoService: RequisicaoService,
    private recursoService: RecursoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarRecursos();
  }

  carregarRecursos(): void {
    this.recursoService.getRecursos().subscribe({
      next: (dados) => {
        //Recursos ativos
        this.recursosDisponiveis.set(dados.filter(r => r.status === true || r.status === 1));
        if (this.recursosDisponiveis().length > 0) {
          this.requisicao.recurso_id = this.recursosDisponiveis()[0].id || 0;
        }
      },
      error: (err) => console.error('Erro ao carregar recursos para o formulário', err)
    });
  }

  gravar(): void {
    this.erroMensagem.set('');

    if (!this.requisicao.recurso_id || !this.requisicao.data_inicio || !this.requisicao.data_fim) {
      this.erroMensagem.set('Por favor, preenche todos os campos obrigatórios.');
      return;
    }

    this.requisicaoService.createRequisicao(this.requisicao as any).subscribe({
      next: () => {
        this.router.navigate(['/requisicoes']);
      },
      error: (erro) => {
        console.error('Erro ao criar requisição:', erro);
        if (erro.error && erro.error.message) {
          this.erroMensagem.set(erro.error.message);
        } else {
          this.erroMensagem.set('Erro ao submeter o pedido. Verifica as datas (devem ser futuras).');
        }
      }
    });
  }
}