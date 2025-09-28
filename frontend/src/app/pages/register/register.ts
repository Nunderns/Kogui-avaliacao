import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  username = '';
  password = '';
  confirmPassword = '';
  message = '';

  constructor(private api: ApiService) {}

  register() {
    if (this.password !== this.confirmPassword) {
      this.message = 'As senhas não coincidem.';
      return;
    }
    this.api.register(this.username, this.password).subscribe({
      next: () => {
        this.message = 'Usuário registrado com sucesso! ✅';
      },
      error: () => {
        this.message = 'Erro ao registrar usuário ❌';
      }
    });
  }
}
