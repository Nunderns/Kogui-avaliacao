import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-pokemons',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pokemons.html',
  styleUrls: ['./pokemons.css']
})
export class PokemonsComponent {
  searchId: number | null = null;
  loading = false;
  error = '';
  pokemon: any = null;
  
  constructor(private api: ApiService) {}

  search() {
    this.error = '';
    this.pokemon = null;
    if (!this.searchId || this.searchId <= 0) {
      this.error = 'Informe um ID válido (ex.: 1, 25, 150)';
      return;
    }
    this.loading = true;
    this.api.getPokemon(this.searchId).subscribe({
      next: (res: { id: number; nome: string; imagem: string; tipos: string[] }) => {
        this.pokemon = res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Pokémon não encontrado';
        this.loading = false;
      }
    });
  }

  toggleFavorito() {
    if (!this.pokemon) return;
    this.api.toggleFavorito(this.pokemon.id).subscribe({
      next: (res: { favorito: boolean }) => {
        alert(res.favorito ? 'Adicionado aos favoritos' : 'Removido dos favoritos');
      }
    });
  }

  toggleGrupo() {
    if (!this.pokemon) return;
    this.api.toggleGrupoBatalha(this.pokemon.id).subscribe({
      next: (res: { erro?: string; grupo_batalha?: boolean }) => {
        if (res.erro) {
          alert(res.erro);
        } else {
          alert(res.grupo_batalha ? 'Adicionado ao grupo de batalha' : 'Removido do grupo de batalha');
        }
      }
    });
  }
}
