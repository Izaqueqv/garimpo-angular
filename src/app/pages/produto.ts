import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProdutoService } from '../services/produto.service';

@Component({
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <section class="conteudo">
      @if (produto; as p) {
        <div class="detalhe">
          <img [src]="'img/' + p.imagem + '.jpg'" [alt]="p.nome">
          <div>
            <span class="etiqueta">{{ p.categoria.toUpperCase() }} · PEÇA ÚNICA</span>
            <h1>{{ p.nome }}</h1>
            <strong class="preco">{{ p.preco | currency:'BRL' }}</strong>
            <p>Tamanho: {{ p.tamanho }}</p>
            <p>{{ p.descricao }}</p>
            <button class="botao" (click)="voltar()">Voltar ao catálogo</button>
            <button class="botao secundario" (click)="editar(p.id)">Editar produto</button>
          </div>
        </div>
      } @else {
        <h1>Produto não encontrado</h1>
        <button class="botao" (click)="voltar()">Voltar ao catálogo</button>
      }
    </section>
  `
})
export class ProdutoDetalhe {
  private router = inject(Router);
  produto = inject(ProdutoService).buscar(Number(inject(ActivatedRoute).snapshot.paramMap.get('id')));

  voltar(): void {
    this.router.navigate(['/produtos']);
  }

  editar(id: number): void {
    this.router.navigate(['/gerenciar'], { queryParams: { editar: id } });
  }
}
