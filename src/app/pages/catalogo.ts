import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ProdutoService } from '../services/produto.service';

@Component({
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <section class="conteudo">
      <span class="etiqueta">NOSSO CATÁLOGO</span>
      <h1>Encontre sua próxima peça</h1>
      <input class="campo" type="text" placeholder="Pesquisar produto..." (input)="pesquisa = $any($event.target).value">
      <div class="grade">
        @for (produto of produtos.listar(); track produto.id) {
          @if (produto.nome.toLowerCase().includes(pesquisa.toLowerCase())) {
            <article class="card">
              <img [src]="'img/' + produto.imagem + '.jpg'" [alt]="produto.nome">
              <div class="card-info">
                <h3>{{ produto.nome }}</h3>
                <p>{{ produto.categoria }} · Tamanho {{ produto.tamanho }}</p>
                <strong>{{ produto.preco | currency:'BRL' }}</strong>
                <p>{{ produto.descricao }}</p>
              </div>
            </article>
          }
        }
      </div>
    </section>
  `
})
export class Catalogo {
  produtos = inject(ProdutoService);
  pesquisa = '';
}