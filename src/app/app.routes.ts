import { Routes } from '@angular/router';
import { admin } from './loja';

// Todas as telas são carregadas sob demanda (lazy loading).
export const routes: Routes = [
  { path: '', loadComponent: () => import('./paginas/home').then(m => m.Home) },
  { path: 'c/:cat', loadComponent: () => import('./paginas/catalogo').then(m => m.Catalogo) },
  { path: 'produto/:id', loadComponent: () => import('./paginas/produto').then(m => m.ProdutoPagina) },
  { path: 'sacola', loadComponent: () => import('./paginas/sacola').then(m => m.Sacola) },
  { path: 'vender', loadComponent: () => import('./paginas/vender').then(m => m.Vender) },
  { path: 'ajuda', loadComponent: () => import('./paginas/ajuda').then(m => m.Ajuda) },
  { path: 'entrar', loadComponent: () => import('./paginas/entrar').then(m => m.Entrar) },
  { path: 'admin', canActivate: [admin], loadChildren: () => import('./admin/admin').then(m => m.rotasAdmin) },
  { path: '**', redirectTo: '' }
];
