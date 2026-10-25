import { Component, computed } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { API, Produto } from '../loja';
import { Card } from '../card';

@Component({
  imports: [RouterLink, Card],
  template: `
    <section class="wrap hero">
      <div class="hero__texto">
        <span class="badge">Brechó online · curadoria semanal</span>
        <h1>Roupa boa não tem <span>prazo de validade.</span></h1>
        <p>Peças garimpadas uma a uma, com fotos reais e medidas em centímetros. Aqui cada peça é única.</p>
        <div class="hero__acoes">
          <a class="btn btn--primario" routerLink="/c/novidades">Ver novidades →</a>
          <a class="btn btn--secundario" routerLink="/vender">Vender minhas peças</a>
        </div>
      </div>
      <div class="hero__fotos">
        <a class="hero__foto hero__foto--a" routerLink="/produto/1"><img src="img/jaqueta-jeans.jpg" alt="Jaqueta jeans"></a>
        <a class="hero__foto hero__foto--b" routerLink="/produto/2"><img src="img/vestido-floral.jpg" alt="Vestido floral"></a>
        <a class="hero__foto hero__foto--c" routerLink="/produto/3"><img src="img/luvas-couro.jpg" alt="Luvas de couro"></a>
      </div>
    </section>
    <section class="wrap secao">
      <h2 class="titulo-2">Garimpe por categoria</h2>
      <div class="categorias">
        @for (c of categorias; track c[0]) {
          <a class="categoria" [routerLink]="'/c/' + c[0]">
            <div class="categoria__foto"><img [src]="'img/' + c[2] + '.jpg'" alt="" loading="lazy"></div>
            <div class="categoria__nome">{{ c[1] }} →</div>
          </a>
        }
      </div>
    </section>
    <section class="wrap secao">
      <h2 class="titulo-2">Acabou de chegar</h2>
      @defer (on viewport) {
        <div class="grade">@for (p of novidades(); track p.id) { <app-card [produto]="p" /> }</div>
      } @placeholder { <p>Carregando peças…</p> }
    </section>
    <section class="vender-cta">
      <div class="wrap vender-cta__grid">
        <div class="vender-cta__texto">
          <h2>Tem peça parada no armário? Ela merece uma segunda volta.</h2>
          <a class="btn btn--destaque" routerLink="/vender">Quero vender minhas peças →</a>
        </div>
      </div>
    </section>
  `
})
export class Home {
  produtos = httpResource<Produto[]>(() => API + 'produtos');
  novidades = computed(() => (this.produtos.value() ?? []).filter(p => !p.vendida).slice(0, 8));
  categorias = [['roupas', 'Roupas', 'camisa-floral'], ['casacos', 'Casacos', 'parka'], ['acessorios', 'Acessórios', 'boina'],
    ['calcados', 'Calçados', 'sandalia-salto'], ['vintage', 'Vintage', 'casaco-pele']];
}
