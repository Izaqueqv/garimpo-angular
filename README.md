# garimpo · brechó online

Projeto da disciplina Desenvolvimento Web Front-End (Universidade FUMEC), feito em Angular.
Esta é a versão do **Trabalho 02**: roteamento, data-binding, diretivas, services e manipulação de dados com mock objects.

**Grupo:** Gabriel Carvalho e Izaque Querino

## Como rodar

Precisa do **Node.js 24.15 ou mais novo** (versão LTS em [nodejs.org](https://nodejs.org)). Confira com `node -v`.

```bash
npm install
npm start
```

Depois acesse http://localhost:4200.

Não há API nem banco de dados nesta etapa. Os produtos ficam em um array dentro do `ProdutoService`,
então o que for cadastrado, editado ou excluído volta aos dados iniciais quando a página é recarregada.

## Páginas

| Página | Rota | O que faz |
|---|---|---|
| Início | `/` | Apresentação do brechó e link para o catálogo |
| Produtos | `/produtos` | Lista e pesquisa os produtos |
| Detalhe do produto | `/produtos/:id` | Mostra as informações de um produto |
| Gerenciar peças | `/gerenciar` | Cadastra, edita e exclui produtos |

## Onde está cada requisito

- **Rotas:** `src/app/app-routing.module.ts` (módulo `AppRoutingModule`)
- **Menu de navegação com `routerLink`:** `src/app/app.ts`
- **Funções de navegação:** `router.navigate()` em `pages/catalogo.ts` e `pages/produto.ts`
- **Service com as regras de negócio:** `src/app/services/produto.service.ts` (`listar`, `buscar`, `pesquisar`, `adicionar`, `atualizar`, `excluir`)
- **Mock objects:** interface `Produto` e array de produtos fictícios no `ProdutoService`
- **Data-binding:** interpolação `{{ }}`, property binding `[src]`, event binding `(click)` e two-way binding `[(ngModel)]`
- **Diretivas:** `ngModel`, `routerLink`, `routerLinkActive` e os blocos de controle `@for`, `@if` e `@empty`

## Imagens

As imagens ficam em `public/img`. Ao cadastrar uma peça, informe o nome do arquivo sem `.jpg` (exemplo: `jaqueta-jeans`).
Fotos de peças: Clothing Dataset (CC0).

## Estrutura

```
src/app/app.ts                        menu e estrutura principal
src/app/app-routing.module.ts         rotas das páginas
src/app/services/produto.service.ts   dados e operações dos produtos
src/app/pages/home.ts                 página inicial
src/app/pages/catalogo.ts             listagem e pesquisa
src/app/pages/produto.ts              detalhe do produto
src/app/pages/gerenciar.ts            cadastro, edição e exclusão
src/styles.css                        estilos do site
```

## Git

Fluxo GitFlow (`main`, `develop`, `feature/*`) e commits no padrão Conventional Commits.
