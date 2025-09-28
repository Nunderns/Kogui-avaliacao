import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface BattleTeamPokemon {
  id: number;
  nome: string;
  imagem: string;
}

@Component({
  selector: 'app-battle-team',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './battle-team.html',
  styleUrls: ['./battle-team.css']
})
export class BattleTeamComponent implements OnInit {
  battleTeam: BattleTeamPokemon[] = [];
  loading = true;
  error = '';
  readonly MAX_TEAM_SIZE = 6;
  readonly API_BASE_URL = 'http://localhost:8000/api';

  constructor(private http: HttpClient, public router: Router) {}

  ngOnInit(): void {
    this.loadBattleTeam();
  }

  private async loadBattleTeam() {
    try {
      const response = await this.http.get<BattleTeamPokemon[]>(`${this.API_BASE_URL}/grupo-batalha/`).toPromise();
      this.battleTeam = response || [];
    } catch (error) {
      console.error('Error loading battle team:', error);
      this.error = 'Erro ao carregar time de batalha. Faça login para ver seu time.';
    } finally {
      this.loading = false;
    }
  }

  onCardClick(pokemon: BattleTeamPokemon) {
    this.router.navigate(['/pokemon', pokemon.id]);
  }

  async removeFromBattleTeam(pokemon: BattleTeamPokemon, event: Event) {
    event.stopPropagation();
    
    try {
      await this.http.post(`${this.API_BASE_URL}/grupo-batalha/${pokemon.id}/`, {}).toPromise();
      this.battleTeam = this.battleTeam.filter(p => p.id !== pokemon.id);
    } catch (error) {
      console.error('Error removing from battle team:', error);
      alert('Erro ao remover do time. Tente novamente.');
    }
  }

  getTeamSize(): number {
    return this.battleTeam.length;
  }

  isTeamFull(): boolean {
    return this.getTeamSize() >= this.MAX_TEAM_SIZE;
  }
}
