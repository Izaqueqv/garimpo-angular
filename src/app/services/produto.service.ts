import { Injectable } from '@angular/core';

export interface Produto {
  id: number;
  nome: string;
  categoria: string;
  tamanho: string;
  preco: number;
  imagem: string;
  descricao: string;
}

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  // Array com dados fictícios (mock objects).
  private produtos: Produto[] = [
    { id: 1, nome: 'Jaqueta jeans', categoria: 'Casacos', tamanho: 'M', preco: 149, imagem: 'jaqueta-jeans', descricao: 'Jaqueta jeans em ótimo estado.' },
    { id: 2, nome: 'Vestido floral', categoria: 'Roupas', tamanho: 'P', preco: 119, imagem: 'vestido-floral', descricao: 'Vestido leve com estampa floral.' },
    { id: 3, nome: 'Luvas de couro', categoria: 'Acessórios', tamanho: 'Único', preco: 89, imagem: 'luvas-couro', descricao: 'Par de luvas de couro.' },
    { id: 4, nome: 'Calça pantalona', categoria: 'Roupas', tamanho: '38', preco: 129, imagem: 'calca-pantalona', descricao: 'Calça de alfaiataria.' },
    { id: 5, nome: 'Blazer risca de giz', categoria: 'Casacos', tamanho: 'G', preco: 159, imagem: 'blazer-risca', descricao: 'Blazer clássico em ótimo estado.' },
    { id: 6, nome: 'Camisa estampada', categoria: 'Roupas', tamanho: 'M', preco: 79, imagem: 'blusa-estampada', descricao: 'Camisa estampada vintage.' }
  ];

  listar(): Produto[] {
    return this.produtos;
  }

  buscar(id: number): Produto | undefined {
    return this.produtos.find(p => p.id === id);
  }

  pesquisar(texto: string): Produto[] {
    const termo = texto.trim().toLowerCase();
    return this.produtos.filter(p => (p.nome + ' ' + p.categoria).toLowerCase().includes(termo));
  }

  adicionar(produto: Produto): void {
    produto.id = this.proximoId();
    this.produtos.push(produto);
  }

  atualizar(produtoAtualizado: Produto): void {
    const indice = this.produtos.findIndex(p => p.id === produtoAtualizado.id);
    if (indice !== -1) {
      this.produtos[indice] = produtoAtualizado;
    }
  }

  excluir(id: number): void {
    this.produtos = this.produtos.filter(p => p.id !== id);
  }

  private proximoId(): number {
    return this.produtos.length > 0
      ? Math.max(...this.produtos.map(p => p.id)) + 1
      : 1;
  }
}