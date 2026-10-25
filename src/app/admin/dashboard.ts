import { Component, computed } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { API, CATS, Produto } from '../loja';

const brl = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const STATUS: Record<string, string> = { aceita: 'Aceitas', analise: 'Em análise', recusada: 'Recusadas' };
interface Pedido { id: string; itens: string[]; total: number; cupom: string; data: string }

// Relatórios calculados a partir dos dados da API.
@Component({
  template: `
    <h1 class="titulo-1">Dashboard</h1>
    <div class="kpis">
      @for (k of kpis(); track k[0]) { <div class="painel kpi"><span class="rotulo texto-2">{{ k[0] }}</span><b>{{ k[1] }}</b></div> }
    </div>
    @defer (on viewport) {
      <div class="paineis">
        @for (g of graficos(); track g.titulo) {
          <section class="painel"><h2>{{ g.titulo }}</h2>
            @for (b of g.barras; track b[0]) {
              <div class="barra"><span>{{ b[0] }}</span><div [style.width.%]="b[1] / g.max * 100"></div><b>{{ g.moeda ? brl(b[1]) : b[1] }}</b></div>
            }
          </section>
        }
      </div>
      <section class="painel"><h2>Peças mais favoritadas</h2>
        <table class="tabela"><tr><th>Peça</th><th>Preço</th><th>Favoritos</th></tr>
          @for (p of favoritas(); track p.id) { <tr><td>{{ p.nome }}</td><td>{{ brl(p.preco) }}</td><td>♥ {{ p.favs }}</td></tr> }
        </table>
      </section>
    } @placeholder { <p>Carregando gráficos…</p> }
  `
})
export class Dashboard {
  brl = brl;
  produtos = httpResource<Produto[]>(() => API + 'produtos', { defaultValue: [] });
  pedidos = httpResource<Pedido[]>(() => API + 'pedidos', { defaultValue: [] });
  propostas = httpResource<{ status: string }[]>(() => API + 'propostas', { defaultValue: [] });

  conta = (lista: string[]) => Object.entries(lista.reduce((c: Record<string, number>, k) => ({ ...c, [k]: (c[k] ?? 0) + 1 }), {}));
  kpis = computed(() => {
    const ped = this.pedidos.value(), fat = ped.reduce((s, p) => s + p.total, 0), prod = this.produtos.value();
    return [['Faturamento', brl(fat)], ['Pedidos', ped.length], ['Ticket médio', brl(fat / (ped.length || 1))],
      ['Disponíveis', prod.filter(p => !p.vendida).length], ['Vendidas', prod.filter(p => p.vendida).length]];
  });
  graficos = computed(() => {
    const vendidos = this.produtos.value().filter(p => p.vendida);
    return [
      ['Faturamento por mês (R$)', Object.entries(this.pedidos.value().reduce((m: Record<string, number>, p) => ({ ...m, [p.data.slice(0, 7)]: (m[p.data.slice(0, 7)] ?? 0) + p.total }), {})).sort()],
      ['Vendas por categoria', this.conta(vendidos.map(p => CATS[p.cat]))],
      ['Propostas de venda', this.conta(this.propostas.value().map(p => STATUS[p.status] ?? p.status))],
      ['Uso de cupons', this.conta(this.pedidos.value().map(p => p.cupom || 'sem cupom'))]
    ].map(([titulo, barras]: any) => ({ titulo, barras, moeda: titulo.includes('R$'), max: Math.max(1, ...barras.map((b: any) => b[1])) }));
  });
  favoritas = computed(() => this.produtos.value().filter(p => !p.vendida).sort((a, b) => b.favs - a.favs).slice(0, 5));
}
