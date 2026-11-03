import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="aviso">Garimpo: peças únicas para dar uma nova história ao seu estilo.</div>
    <header class="cabecalho">
      <a class="logo" routerLink="/">garimpo<span>.</span></a>
      <nav>
        <a routerLink="/" routerLinkActive="ativo" [routerLinkActiveOptions]="{exact:true}">Início</a>
        <a routerLink="/produtos" routerLinkActive="ativo">Produtos</a>
        <a routerLink="/gerenciar" routerLinkActive="ativo">Gerenciar peças</a>
      </nav>
    </header>
    <main><router-outlet /></main>
    <footer>© 2026 Garimpo - Brechó online</footer>
  `
})
export class App {}