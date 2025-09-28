import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css']
})
export class ResetPasswordComponent {
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  loading = false;
  error = '';
  success = '';

  constructor(private api: ApiService, public router: Router) {}

  passwordsMatch(): boolean {
    return !!this.newPassword && this.newPassword === this.confirmPassword;
  }

  canSubmit(): boolean {
    return !!this.currentPassword && !!this.newPassword && this.passwordsMatch() && !this.loading;
  }

  async onSubmit() {
    this.error = '';
    this.success = '';
    if (!this.passwordsMatch()) {
      this.error = 'As senhas novas não coincidem.';
      return;
    }
    this.loading = true;
    try {
      await this.api.changePassword(this.currentPassword, this.newPassword).toPromise();
      this.success = 'Senha alterada com sucesso! Faça login novamente.';
      // Opcional: limpar tokens locais
      localStorage.removeItem('access_token');
      setTimeout(() => this.router.navigate(['/login']), 1500);
    } catch (e: any) {
      console.error('Erro ao alterar senha', e);
      this.error = e?.error?.detail || 'Não foi possível alterar a senha. Verifique a senha atual e tente novamente.';
    } finally {
      this.loading = false;
    }
  }
}
