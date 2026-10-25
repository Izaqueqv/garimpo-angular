import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { API, CATS, Loja, Produto } from '../loja';

// Gestão de produtos: consulta, pesquisa e remoção.
@Component({
  imports: [RouterLink, CurrencyPipe],
  template: `
    <h1 class="titulo-1">Produtos</h1>
    <div class="painel">
      <input class="campo" placeholder="Buscar por nome ou marca" (input)="busca.set($any($event.target).value)">
      <table class="tabela">
        <tr><th></th><th>Peça</th><th>Categoria</th><th>Tam.</th><th>Preço</th><th>Situação</th><th></th></tr>
        @for (p of lista(); track p.id) {
          <tr>
            <td><img [src]="'img/' + p.fotos[0] + '.jpg'" alt=""></td><td>{{ p.nome }}</td><td>{{ cats[p.cat] }}</td><td>{{ p.tam }}</td>
            <td>{{ p.preco | currency }}</td><td>{{ p.vendida ? 'Vendida' : 'Disponível' }}</td>
            <td><a [routerLink]="'/admin/produto/' + p.id">Editar</a> · <button class="link-btn" (click)="remover(p)">Remover</button></td>
          </tr>
        }
      </table>
    </div>
  `
})
export class Produtos {
  loja = inject(Loja);
  cats = CATS;
  busca = signal('');
  produtos = httpResource<Produto[]>(() => API + 'produtos', { defaultValue: [] });
  lista = computed(() => this.produtos.value().filter(p => (p.nome + p.marca).toLowerCase().includes(this.busca().toLowerCase())));
  remover(p: Produto) {
    if (confirm(`Remover "${p.nome}"?`)) this.loja.http.delete(API + 'produtos/' + p.id).subscribe(() => this.produtos.reload());
  }
}
