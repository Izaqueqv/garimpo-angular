import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, Routes } from '@angular/router';
import { Loja } from '../loja';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="wrap admin">
      <nav class="admin__menu">
        <a routerLink="/admin" routerLinkActive="ativo" [routerLinkActiveOptions]="{ exact: true }">Dashboard</a>
        <a routerLink="/admin/produtos" routerLinkActive="ativo">Produtos</a>
        <a routerLink="/admin/produto/novo" routerLinkActive="ativo">Nova peça</a>
        <button (click)="loja.usuario.set(null); router.navigate(['/'])">Sair</button>
      </nav>
      <div class="admin__conteudo"><router-outlet /></div>
    </div>
  `
})
export class Admin {
  loja = inject(Loja);
  router = inject(Router);
}

export const rotasAdmin: Routes = [{
  path: '', component: Admin, children: [
    { path: '', loadComponent: () => import('./dashboard').then(m => m.Dashboard) },
    { path: 'produtos', loadComponent: () => import('./produtos').then(m => m.Produtos) },
    { path: 'produto/:id', loadComponent: () => import('./produto-form').then(m => m.ProdutoForm) }
  ]
}];
