import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  credenciais = {
    email: '',
    password: ''
  };

  erroMensagem = signal<string>('');
  aCarregar = signal<boolean>(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  submeterLogin(): void {
    this.erroMensagem.set('');
    
    if (!this.credenciais.email || !this.credenciais.password) {
      this.erroMensagem.set('Por favor, preenche todos os campos.');
      return;
    }

    this.aCarregar.set(true);

    this.authService.login(this.credenciais).subscribe({
      next: (resposta) => {
        this.aCarregar.set(false);
        this.router.navigate(['/recursos']);
      },
      error: (erro) => {
        this.aCarregar.set(false);
        console.error('Erro no login:', erro);
        if (erro.status === 422 && erro.error.errors) {
          const mensagens = Object.values(erro.error.errors).flat().join(' ');
          this.erroMensagem.set(mensagens);
        } else {
          this.erroMensagem.set('Dados incorretos ou problemas com o server.');
        }
      }
    });
  }
}