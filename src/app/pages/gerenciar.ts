import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Produto, ProdutoService } from '../services/produto.service';
import { CurrencyPipe } from '@angular/common';


@Component({
  standalone: true,
  imports: [FormsModule, CurrencyPipe],
  template: `
    <section class="conteudo">
      <span class="etiqueta">ÁREA ADMINISTRATIVA</span>
      <h1>Gerenciar produtos</h1>
      <p>Cadastre, edite ou exclua produtos do catálogo.</p>

      <form class="formulario" (ngSubmit)="salvar()">
        <label>Nome do produto
          <input name="nome" [(ngModel)]="produto.nome" required>
        </label>
        <label>Categoria
          <select name="categoria" [(ngModel)]="produto.categoria">
            <option>Roupas</option><option>Casacos</option><option>Acessórios</option><option>Calçados</option>
          </select>
        </label>
        <label>Tamanho
          <input name="tamanho" [(ngModel)]="produto.tamanho" required>
        </label>
        <label>Preço (R$)
          <input name="preco" type="number" min="1" [(ngModel)]="produto.preco" required>
        </label>
        <label>Imagem (nome do arquivo, sem .jpg)
          <input name="imagem" [(ngModel)]="produto.imagem" placeholder="Ex.: jaqueta-jeans" required>
        </label>
        <label>Descrição
          <input name="descricao" [(ngModel)]="produto.descricao">
        </label>
        <div class="acoes">
          <button class="botao" type="submit">{{ editando ? 'Salvar alterações' : 'Cadastrar produto' }}</button>
          @if (editando) { <button class="botao secundario" type="button" (click)="limpar()">Cancelar</button> }
        </div>
      </form>

      <h2>Produtos cadastrados</h2>
      <div class="lista">
        @for (item of produtos.listar(); track item.id) {
          <div class="linha-produto">
            <span><strong>{{ item.nome }}</strong> — {{ item.preco | currency:'BRL' }}</span>
            <div>
              <button class="link" (click)="editar(item)">Editar</button>
              <button class="link excluir" (click)="excluir(item.id)">Excluir</button>
            </div>
          </div>
        }
      </div>
    </section>
  `
})
export class Gerenciar implements OnInit {
  produtos = inject(ProdutoService);
  editando = false;
  produto: Produto = this.novoProduto();
  private rota = inject(ActivatedRoute);

  // Ao vir da página de detalhe (/gerenciar?editar=ID), já abre o produto para edição.
  ngOnInit(): void {
    const item = this.produtos.buscar(Number(this.rota.snapshot.queryParamMap.get('editar')));
    if (item) this.editar(item);
  }

  novoProduto(): Produto {
    return { id: 0, nome: '', categoria: 'Roupas', tamanho: 'M', preco: 0, imagem: '', descricao: '' };
  }

  salvar(): void {
    if (!this.produto.nome || !this.produto.tamanho || this.produto.preco <= 0 || !this.produto.imagem) {
      return;
    }

    if (this.editando) {
      this.produtos.atualizar(this.produto);
    } else {
      this.produtos.adicionar(this.produto);
    }
    this.limpar();
  }

  editar(item: Produto): void {
    this.produto = { ...item };
    this.editando = true;
  }

  excluir(id: number): void {
    if (confirm('Deseja excluir este produto?')) {
      this.produtos.excluir(id);
      if (this.produto.id === id) this.limpar();
    }
  }

  limpar(): void {
    this.produto = this.novoProduto();
    this.editando = false;
  }
}