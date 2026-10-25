import { Component, inject, input, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { API, CATS, ESTADOS, Loja, Produto } from '../loja';

// Componente de detalhe da peça (rota produto/:id).
@Component({
  imports: [RouterLink],
  template: `
    @if (produto.value(); as p) {
      <div class="wrap pagina">
        <nav class="migalha"><a routerLink="/">Início</a> / <a [routerLink]="'/c/' + p.cat">{{ cats[p.cat] }}</a> / {{ p.nome }}</nav>
        <div class="produto">
          <div class="galeria">
            <div class="galeria__principal"><img [src]="'img/' + p.fotos[foto()] + '.jpg'" [alt]="p.nome"><span class="badge">Peça única</span></div>
            <div class="miniaturas">
              @for (f of p.fotos; track f; let i = $index) {
                <button class="miniatura" [attr.aria-pressed]="i === foto()" (click)="foto.set(i)"><img [src]="'img/' + f + '.jpg'" alt=""></button>
              }
            </div>
          </div>
          <div class="info">
            <span class="rotulo texto-2">{{ p.marca }}</span>
            <h1>{{ p.nome }}</h1>
            <div class="info__preco"><b>R$ {{ p.preco }}</b><span>ou 3x de R$ {{ (p.preco / 3).toFixed(2) }} sem juros</span></div>
            <div class="aviso"><strong>Só existe 1.</strong> Quando alguém compra, ela sai do site.</div>
            <div class="blocos">
              <div class="bloco"><span class="rotulo texto-2">Tamanho</span><b>{{ p.tam }}</b></div>
              <div class="bloco"><span class="rotulo texto-2">Estado</span><b>{{ estados[p.estado] }}</b></div>
            </div>
            <div class="medidas"><h2>Medidas reais (cm)</h2>
              <table><tbody>@for (m of p.medidas; track m[0]) { <tr><th>{{ m[0] }}</th><td>{{ m[1] }}</td></tr> }</tbody></table>
            </div>
            <div class="acoes">
              @if (p.vendida) { <button class="btn btn--bloco" disabled>Peça vendida</button> }
              @else if (loja.naSacola(p)) { <a class="btn btn--escuro btn--bloco" routerLink="/sacola">✓ Está na sacola</a> }
              @else { <button class="btn btn--primario btn--bloco" (click)="loja.adicionar(p)">Adicionar à sacola</button> }
              <button class="fav-grande fav-btn" [attr.aria-pressed]="loja.favorito(p)" (click)="loja.favoritar(p)">♥</button>
            </div>
            <div class="detalhes">
              <details open><summary>Marcas de uso</summary><p>{{ p.uso }}</p></details>
              <details><summary>Descrição</summary><p>{{ p.desc }}</p></details>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class ProdutoPagina {
  id = input.required<string>();
  produto = httpResource<Produto>(() => API + 'produtos/' + this.id());
  loja = inject(Loja);
  foto = signal(0);
  estados = ESTADOS;
  cats = CATS;
}
