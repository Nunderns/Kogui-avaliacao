import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface FavoritePokemon {
  id: number;
  nome: string;
  imagem: string;
}

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.html',
  styleUrls: ['./favorites.css']
})
export class FavoritesComponent implements OnInit {
  favorites: FavoritePokemon[] = [];
  loading = true;
  error = '';
  readonly API_BASE_URL = 'http://localhost:8000/api';

  constructor(private http: HttpClient, public router: Router) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  private async loadFavorites() {
    try {
      const response = await this.http.get<FavoritePokemon[]>(`${this.API_BASE_URL}/favoritos/`).toPromise();
      this.favorites = response || [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      this.error = 'Erro ao carregar favoritos. Faça login para ver seus Pokémon favoritos.';
    } finally {
      this.loading = false;
    }
  }

  onCardClick(pokemon: FavoritePokemon) {
    this.router.navigate(['/pokemon', pokemon.id]);
  }

  async removeFavorite(pokemon: FavoritePokemon, event: Event) {
    event.stopPropagation();
    
    try {
      await this.http.post(`${this.API_BASE_URL}/favoritos/${pokemon.id}/`, {}).toPromise();
      this.favorites = this.favorites.filter(fav => fav.id !== pokemon.id);
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Erro ao remover favorito. Tente novamente.');
    }
  }
}
