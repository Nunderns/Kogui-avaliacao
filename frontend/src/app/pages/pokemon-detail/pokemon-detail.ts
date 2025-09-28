import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

interface PokemonDetail {
  id: number;
  nome: string;
  imagem: string;
  tipos: string[];
  altura: number;
  peso: number;
  habilidades: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    'special-attack': number;
    'special-defense': number;
    speed: number;
  };
}

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-detail.html',
  styleUrls: ['./pokemon-detail.css']
})
export class PokemonDetailComponent implements OnInit {
  pokemon: PokemonDetail | null = null;
  loading = true;
  error = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPokemon(Number(id));
    } else {
      this.error = 'Pokémon não encontrado';
      this.loading = false;
    }
  }

  private loadPokemon(id: number) {
    this.http.get<any>(`https://pokeapi.co/api/v2/pokemon/${id}`).subscribe({
      next: (p) => {
        const stats: any = {};
        p.stats?.forEach((s: any) => {
          stats[s.stat.name] = s.base_stat;
        });
        this.pokemon = {
          id: p.id,
          nome: p.name,
          imagem: p.sprites?.other?.['official-artwork']?.front_default || p.sprites?.front_default,
          tipos: p.types?.map((t: any) => t.type.name) || [],
          altura: p.height,
          peso: p.weight,
          habilidades: p.abilities?.map((a: any) => a.ability.name) || [],
          stats
        };
        this.loading = false;
      },
      error: () => {
        this.error = 'Falha ao carregar Pokémon';
        this.loading = false;
      }
    });
  }
}
