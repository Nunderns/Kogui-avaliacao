import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';  // 👈 nome correto do service
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',   // 👈 nome correto
  styleUrls: ['./login.css']     // 👈 nome correto
})
export class LoginComponent {
  username = '';
  password = '';
  message = '';

  constructor(private api: ApiService, private router: Router) {}

  login() {
    this.api.login(this.username, this.password).subscribe({
      next: (res: any) => {
        localStorage.setItem('access_token', res.access);
        localStorage.setItem('username', this.username);
        this.message = 'Login bem-sucedido ✅';
        // Redireciona para /pokemons após login
        this.router.navigate(['/pokemons']);
      },
      error: () => {
        this.message = 'Erro no login ❌';
      }
    });
  }
}
