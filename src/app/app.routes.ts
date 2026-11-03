import { Routes } from '@angular/router';
import { Home } from './pages/home';
import { Catalogo } from './pages/catalogo';
import { Gerenciar } from './pages/gerenciar';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'produtos', component: Catalogo },
  { path: 'gerenciar', component: Gerenciar },
  { path: '**', redirectTo: '' }
];