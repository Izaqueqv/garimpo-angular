# garimpo · brechó online

Projeto da disciplina Desenvolvimento Web Front-End (Universidade FUMEC). Brechó online de peças únicas, feito em Angular.

**Grupo:** Gabriel Carvalho e Izaque Querino

## Como rodar

```bash
npm install
npm run dev
```

O comando `dev` sobe a API (JSON-Server em http://localhost:3000) e o site (http://localhost:4200) juntos.
Também dá para rodar separado: `npm run api` e `npm start`.

**Login de teste:** `admin@garimpo.com` / `admin123` (administrador) ou `cliente@garimpo.com` / `cliente123`.

## Telas

| Tela | Rota | Acesso |
|---|---|---|
| Início | `/` | Pública |
| Catálogo (categorias, vintage, favoritos, busca) | `/c/:cat` | Pública |
| Detalhe do produto | `/produto/:id` | Pública |
| Sacola | `/sacola` | Pública (finalizar exige login) |
| Vender peças | `/vender` | Pública |
| Ajuda | `/ajuda` | Pública |
| Entrar e criar conta | `/entrar` | Pública |
| Dashboard de relatórios | `/admin` | Administrador |
| Gestão de produtos | `/admin/produtos` | Administrador |
| Cadastro e edição de produto | `/admin/produto/:id` | Administrador |

## Onde está cada requisito

- **Listagem:** `paginas/catalogo.ts` e `admin/produtos.ts`
- **Detalhe:** `paginas/produto.ts`
- **Formulários (Reactive Forms):** `paginas/entrar.ts`, `paginas/vender.ts`, `admin/produto-form.ts`
- **Proteção de rotas:** guard `admin` em `loja.ts` (e login exigido para finalizar a compra na sacola)
- **Lazy loading:** `loadComponent`/`loadChildren` em `app.routes.ts` e `admin/admin.ts`, `@defer` na home e no dashboard, `loading="lazy"` nas imagens
- **Dashboard:** `admin/dashboard.ts`
- **Web API:** JSON-Server (`db.json`) com `HttpClient`/`httpResource` e ViaCEP na sacola

## Estrutura

```
db.json                 dados da API (produtos, usuarios, pedidos, propostas)
src/app/loja.ts         tipos, estado da loja (sacola, favoritos, usuário) e guards
src/app/app.routes.ts   rotas com lazy loading
src/app/card.ts         card de produto
src/app/paginas/        telas da loja
src/app/admin/          telas do administrador
```

## Git

Fluxo GitFlow (`main`, `develop`, `feature/*`) e commits no padrão Conventional Commits.
