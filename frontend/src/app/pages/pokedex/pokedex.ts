import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface PokemonCard {
  id: number;
  nome: string;
  imagem: string;
  tipos: string[];
  stats?: {
    hp: number;
    attack: number;
    defense: number;
    'special-attack': number;
    'special-defense': number;
    speed: number;
  };
}

@Component({
  selector: 'app-pokedex',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pokedex.html',
  styleUrls: ['./pokedex.css']
})
export class PokedexComponent implements OnInit {
  // UI state
  loading = false;
  error = '';

  // Filters
  generation = 1;
  nameQuery = '';

  // Data
  cards = signal<PokemonCard[]>([]);
  filtered = computed(() => {
    const q = this.nameQuery.trim().toLowerCase();
    if (!q) return this.cards();
    return this.cards().filter(c => c.nome.toLowerCase().includes(q));
  });
  uniqueTypesCount = computed(() => {
    const all = this.cards().flatMap(c => c.tipos);
    return Array.from(new Set(all)).length;
  });

  hoveredCard: PokemonCard | null = null;

  onCardHover(card: PokemonCard | null) {
    this.hoveredCard = card;
  }

  onCardClick(card: PokemonCard) {
    this.router.navigate(['/pokemon', card.id]);
  }

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadGeneration(this.generation);
  }

  onGenerationChange(gen: number) {
    if (this.generation === gen) return;
    this.generation = gen;
    this.nameQuery = '';
    this.loadGeneration(gen);
  }

  private loadGeneration(gen: number) {
    this.loading = true;
    this.error = '';
    this.cards.set([]);

    // 1) get species for generation
    this.http.get<any>(`https://pokeapi.co/api/v2/generation/${gen}/`).subscribe({
      next: (genData) => {
        const species: Array<{ name: string; url: string }> = genData.pokemon_species;
        // Sort by species ID (the URL ends with /pokemon-species/{id}/)
        const ids = species
          .map(s => Number(s.url.split('/').filter(Boolean).pop()))
          .filter(n => !Number.isNaN(n))
          .sort((a, b) => a - b);

        // Cap to first 30 for performance; you can increase later
        const limited = ids.slice(0, 30);
        let done = 0;
        const results: PokemonCard[] = [];

        if (limited.length === 0) {
          this.cards.set([]);
          this.loading = false;
          return;
        }

        limited.forEach(id => {
          this.http.get<any>(`https://pokeapi.co/api/v2/pokemon/${id}`).subscribe({
            next: (p) => {
              const stats: any = {};
              p.stats?.forEach((s: any) => {
                stats[s.stat.name] = s.base_stat;
              });
              const card: PokemonCard = {
                id: p.id,
                nome: p.name,
                imagem: p.sprites?.other?.['official-artwork']?.front_default || p.sprites?.front_default,
                tipos: p.types?.map((t: any) => t.type.name) || [],
                stats
              };
              results.push(card);
            },
            error: () => {
              // ignore single failures
            },
            complete: () => {
              done++;
              if (done === limited.length) {
                results.sort((a, b) => a.id - b.id);
                this.cards.set(results);
                this.loading = false;
              }
            }
          });
        });
      },
      error: () => {
        this.error = 'Falha ao carregar geração.';
        this.loading = false;
      }
    });
  }
}
