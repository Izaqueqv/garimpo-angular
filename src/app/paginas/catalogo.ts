import { Component, computed, inject, input, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { API, CATS, ESTADOS, Loja, Produto } from '../loja';
import { Card } from '../card';

// Componente de listagem: categorias, novidades, vintage, favoritos e busca.
@Component({
  imports: [Card],
  template: `
    <div class="wrap pagina">
      <h1 class="titulo-1">{{ titulo() }}</h1>
      <div class="catalogo">
        <aside class="filtros">
          <fieldset><legend>Tamanho</legend>
            <div class="pills">
              @for (t of tamanhos(); track t) { <button class="pill" [attr.aria-pressed]="tam() === t" (click)="tam.set(tam() === t ? '' : t)">{{ t }}</button> }
            </div>
          </fieldset>
          <fieldset><legend>Estado</legend>
            @for (e of [4, 3, 2, 1]; track e) {
              <label class="check"><input type="radio" name="estado" [checked]="estado() === e" (change)="estado.set(e)">{{ estados[e] }}</label>
            }
          </fieldset>
          <fieldset><legend>Preço máximo (R$)</legend><input class="campo" type="number" (input)="max.set(+$any($event.target).value)"></fieldset>
          <button class="link-btn" (click)="tam.set(''); estado.set(0); max.set(0)">Limpar filtros</button>
        </aside>
        <section class="resultados">
          <label class="ordenar">Ordenar por
            <select (change)="ordem.set($any($event.target).value)">
              <option value="">Mais recentes</option><option value="menor">Menor preço</option><option value="maior">Maior preço</option>
            </select>
          </label>
          <span class="chips__total">{{ lista().length }} peças encontradas</span>
          <div class="grade">@for (p of lista(); track p.id) { <app-card [produto]="p" /> } @empty { <p>Nenhuma peça encontrada.</p> }</div>
        </section>
      </div>
    </div>
  `
})
export class Catalogo {
  cat = input.required<string>();
  q = input('');
  loja = inject(Loja);
  estados = ESTADOS;
  produtos = httpResource<Produto[]>(() => API + 'produtos');
  tam = signal(''); estado = signal(0); max = signal(0); ordem = signal('');
  titulo = computed(() => this.cat() === 'busca' ? `Busca: “${this.q()}”` : CATS[this.cat()] ?? this.cat()[0].toUpperCase() + this.cat().slice(1));
  base = computed(() => (this.produtos.value() ?? []).filter(p => {
    const c = this.cat();
    if (c === 'vintage') return p.vintage;
    if (c === 'favoritos') return this.loja.favoritos().includes(p.id);
    if (c === 'busca') return (p.nome + p.marca + p.tipo).toLowerCase().includes(this.q().toLowerCase());
    return c === 'novidades' || p.cat === c;
  }));
  tamanhos = computed(() => [...new Set(this.base().map(p => p.tam))]);
  lista = computed(() => this.base()
    .filter(p => (!this.tam() || p.tam === this.tam()) && (!this.estado() || p.estado === this.estado()) && (!this.max() || p.preco <= this.max()))
    .sort((a, b) => this.ordem() === 'menor' ? a.preco - b.preco : this.ordem() === 'maior' ? b.preco - a.preco : +a.vendida - +b.vendida));
}
