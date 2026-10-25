import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ESTADOS, Loja, Produto } from './loja';

@Component({
  selector: 'app-card',
  imports: [RouterLink],
  template: `
    @let p = produto();
    <article class="card" [class.card--vendida]="p.vendida">
      <a class="card__link" [routerLink]="'/produto/' + p.id">
        <div class="card__foto">
          <img [src]="'img/' + p.fotos[0] + '.jpg'" [alt]="p.nome" loading="lazy">
          @if (p.vendida) { <span class="badge badge--escuro">Vendida</span> } @else if (p.badge) { <span class="badge">{{ p.badge }}</span> }
        </div>
        <div class="card__info">
          <span class="card__marca">{{ p.marca }}</span>
          <span class="card__nome">{{ p.nome }}</span>
          <span class="card__meta">Tam. {{ p.tam }} · {{ estados[p.estado] }}</span>
          <span class="card__preco">R$ {{ p.preco }}</span>
        </div>
      </a>
      <button class="fav-btn" [attr.aria-pressed]="loja.favorito(p)" (click)="loja.favoritar(p)" aria-label="Favoritar">♥</button>
    </article>
  `
})
export class Card {
  produto = input.required<Produto>();
  loja = inject(Loja);
  estados = ESTADOS;
}
