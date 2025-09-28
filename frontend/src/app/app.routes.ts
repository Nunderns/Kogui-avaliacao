import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { PokemonsComponent } from './pages/pokemons/pokemons';
import { PokedexComponent } from './pages/pokedex/pokedex';
import { PokemonDetailComponent } from './pages/pokemon-detail/pokemon-detail';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'pokemons', component: PokemonsComponent },
  { path: 'pokedex', component: PokedexComponent },
  { path: 'pokemon/:id', component: PokemonDetailComponent },
  { path: '', redirectTo: 'pokedex', pathMatch: 'full' },
  { path: '**', redirectTo: 'pokedex' }
];
