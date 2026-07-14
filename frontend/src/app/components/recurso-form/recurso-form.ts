import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RecursoService, Recurso } from '../../services/recurso';

@Component({
  selector: 'app-recurso-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './recurso-form.html',
})
export class RecursoForm implements OnInit {
  recurso: Recurso = {
    nome: '',
    tipo: 'espaco', //Valor padrão inicial
    descricao: '',
    status: true
  };

  isEdicao: boolean = false;
  idRecurso?: number;

  constructor(
    private recursoService: RecursoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    //Obtem o ID da rota para saber se se está a criar ou editar um recurso
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdicao = true;
      this.idRecurso = Number(idParam);
      this.carregarRecurso(this.idRecurso);
    }
  }

  carregarRecurso(id: number): void {
    this.recursoService.getRecurso(id).subscribe({
      next: (dados) => {
        //Converte o status vindo do Laravel para boolean se vier como 0 ou 1
        this.recurso = {
          ...dados,
          status: !!dados.status
        };
      },
      error: (erro) => console.error('Erro ao carregar o recurso:', erro)
    });
  }

  guardar(): void {
    if (!this.recurso.nome || this.recurso.nome.trim() === '') {
      return;
    }

    const dadosParaSubmeter: Recurso = {
      ...this.recurso,
      status: this.recurso.status ? 1 : 0
    };

    if (this.isEdicao && this.idRecurso) {
      this.recursoService.updateRecurso(this.idRecurso, dadosParaSubmeter).subscribe({
        next: () => this.router.navigate(['/recursos']),
        error: (erro) => {
          console.error('Erro ao atualizar recurso:', erro);
          alert('Erro ao atualizar. Verifique os dados.');
        }
      });
    } else {
      this.recursoService.createRecurso(dadosParaSubmeter).subscribe({
        next: () => this.router.navigate(['/recursos']),
        error: (erro) => {
          console.error('Erro ao criar recurso:', erro);
          alert('Erro ao criar recurso. Tente novamente.');
        }
      });
    }
  }
}