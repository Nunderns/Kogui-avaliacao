import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://127.0.0.1:8000/api';
  constructor(private http: HttpClient) {}

  // 🔹 Login - retorna o JWT
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/token/`, { username, password });
  }

  // 🔹 Buscar Pokémon por ID
  getPokemon(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/pokemon/${id}/`);
  }

  // 🔹 Listar Favoritos
  getFavoritos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/favoritos/`);
  }

  // 🔹 Adicionar/remover Favorito
  toggleFavorito(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/favoritos/${id}/`, {});
  }

  // 🔹 Listar Grupo de Batalha
  getGrupoBatalha(): Observable<any> {
    return this.http.get(`${this.baseUrl}/grupo-batalha/`);
  }


  // 🔹 Registrar novo usuário
  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register/`, { username, password });
  }

  // 🔹 Adicionar/remover do Grupo de Batalha
  toggleGrupoBatalha(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/grupo-batalha/${id}/`, {});
  }

  // 🔹 Alterar senha do usuário autenticado
  changePassword(current_password: string, new_password: string): Observable<any> {
    // Ajuste o endpoint conforme o backend exposto (ex.: /change-password/ ou /users/change-password/)
    return this.http.post(`${this.baseUrl}/change-password/`, {
      current_password,
      new_password
    });
  }
}
