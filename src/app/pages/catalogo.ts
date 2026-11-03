import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProdutoService } from '../services/produto.service';

@Component({
  standalone: true,
  imports: [CurrencyPipe, FormsModule],
  template: `
    <section class="conteudo">
      <span class="etiqueta">NOSSO CATÁLOGO</span>
      <h1>Encontre sua próxima peça</h1>
      <input class="campo" type="text" name="pesquisa" placeholder="Pesquisar por nome ou categoria..." [(ngModel)]="pesquisa">
      <div class="grade">
        @for (produto of produtos.pesquisar(pesquisa); track produto.id) {
          <article class="card">
            <img [src]="'img/' + produto.imagem + '.jpg'" [alt]="produto.nome">
            <div class="card-info">
              <h3>{{ produto.nome }}</h3>
              <p>{{ produto.categoria }} · Tamanho {{ produto.tamanho }}</p>
              <strong>{{ produto.preco | currency:'BRL' }}</strong>
              <p>{{ produto.descricao }}</p>
            </div>
          </article>
        } @empty {
          <p>Nenhum produto encontrado.</p>
        }
      </div>
    </section>
  `
})
export class Catalogo {
  produtos = inject(ProdutoService);
  pesquisa = '';
}