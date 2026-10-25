import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Loja } from './loja';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="topbar">Peças únicas · quando vende, não volta · primeira compra? use <strong>GARIMPO10</strong></div>
    <header class="header">
      <div class="wrap header__row">
        <a class="logo" routerLink="/"><img src="logo.svg" width="26" alt="">garimpo</a>
        <button class="icon-btn menu-btn" (click)="menu = !menu" aria-label="Menu"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
        <nav class="nav" [class.aberto]="menu" (click)="menu = false">
          @for (l of links; track l[0]) {
            <a [routerLink]="'/c/' + l[0]" routerLinkActive="ativo">{{ l[1] }}</a>
          }
          <a routerLink="/vender" class="nav__destaque">Vender peças</a>
        </nav>
        <div class="header__acoes">
          <form class="busca" (submit)="buscar($event, q.value)"><input #q type="search" placeholder="Buscar peças…"></form>
          <a class="icon-btn" [routerLink]="loja.usuario()?.perfil === 'admin' ? '/admin' : '/entrar'" aria-label="Conta"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg></a>
          <a class="icon-btn" routerLink="/c/favoritos" aria-label="Favoritos"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/></svg>
            @if (loja.favoritos().length) { <span class="contador">{{ loja.favoritos().length }}</span> }</a>
          <a class="icon-btn" routerLink="/sacola" aria-label="Sacola"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 7h12l1 14H5L6 7zM9 7a3 3 0 0 1 6 0"/></svg>
            @if (loja.sacola().length) { <span class="contador contador--azul">{{ loja.sacola().length }}</span> }</a>
        </div>
      </div>
    </header>
    <main><router-outlet /></main>
    <footer class="footer">
      <div class="wrap footer__base">
        <span>© 2026 garimpo · brechó online de peças únicas</span>
        <a routerLink="/ajuda">Ajuda: medidas, estado, envio e trocas</a>
      </div>
    </footer>
  `
})
export class App {
  loja = inject(Loja);
  router = inject(Router);
  menu = false;
  links = [['novidades', 'Novidades'], ['roupas', 'Roupas'], ['casacos', 'Casacos'], ['acessorios', 'Acessórios'], ['calcados', 'Calçados'], ['vintage', 'Vintage']];
  buscar(e: Event, q: string) { e.preventDefault(); this.router.navigate(['/c/busca'], { queryParams: { q } }); }
}
