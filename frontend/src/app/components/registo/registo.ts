import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-registo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registo.html',
  styleUrls: ['./registo.css']
})
export class RegistoComponent {
  dados = {
    name: '',
    email: '',
    password: '',
    role: 'colaborador'
  };

  mensagemErro: string | null = null;
  mensagemSucesso: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  submeterRegisto(): void {
    this.mensagemErro = null;
    this.mensagemSucesso = null;
  
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.dados.email)) {
      this.mensagemErro = 'Introduz um e-mail válido (ex: .com, .pt).';
      return; 
    }

    this.authService.registar(this.dados).subscribe({
      next: () => {
        this.mensagemSucesso = 'Utilizador criado com sucesso!';
        
        this.dados = { name: '', email: '', password: '', role: 'colaborador' };
        
        setTimeout(() => {
          this.router.navigate(['/recursos']);
        }, 1000);
      },
      error: (err) => {
        if (err.error?.errors?.email) {
          this.mensagemErro = 'Este e-mail já existe.';
        } else {
          this.mensagemErro = 'Erro ao criar utilizador.';
        }
      }
    });
  }
}