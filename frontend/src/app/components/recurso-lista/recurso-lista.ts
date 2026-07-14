import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RecursoService, Recurso } from '../../services/recurso';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-recurso-lista',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recurso-lista.html',
  styleUrls: ['./recurso-lista.css']
})
export class RecursoLista implements OnInit {
  recursos = signal<Recurso[]>([]);
  loading = signal<boolean>(true);

  constructor(
    private recursoService: RecursoService,
    private authService: AuthService
  ) {}

  isAdmin(): boolean {
    return this.authService.getRole() === 'admin';
  }

  ngOnInit(): void {
    this.carregarRecursos();
  }

  carregarRecursos(): void {
    this.loading.set(true);
    this.recursoService.getRecursos().subscribe({
      next: (dados) => {
        this.recursos.set(dados);
        this.loading.set(false);
      },
      error: (erro) => {
        console.error('Erro a obter recursos ao Laravel:', erro);
        this.loading.set(false);
      }
    });
  }

  eliminarRecurso(id: number | undefined): void {
    if (!id) return;
    
    if (confirm('Tens a certeza que queres eliminar este recurso?')) {
      this.recursoService.deleteRecurso(id).subscribe({
        next: () => {
          //O recurso desaparece da página após delete sem ser preciso dar rr à página
          this.recursos.update(lista => lista.filter(r => r.id !== id));
        },
        error: (erro) => {
          console.error('Erro ao eliminar o recurso:', erro);
        }
      });
    }
  }
}