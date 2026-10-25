import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { API, Loja } from '../loja';

@Component({
  imports: [RouterLink],
  template: `
    <div class="wrap pagina">
      <h1 class="titulo-1">Sua sacola</h1>
      @if (pedido()) {
        <div class="vazio"><h2>Pedido nº {{ pedido() }} recebido!</h2><p>As peças saíram da vitrine e estão separadas para você.</p>
          <a class="btn btn--primario" routerLink="/c/novidades">Continuar garimpando</a></div>
      } @else if (!loja.sacola().length) {
        <div class="vazio"><h2>Sua sacola está vazia</h2><a class="btn btn--primario" routerLink="/c/novidades">Ver novidades</a></div>
      } @else {
        <div class="sacola">
          <section class="sacola__itens">
            <div class="aviso">⏱ Reservadas por <strong class="relogio">{{ tempo() }}</strong>. Depois disso, voltam para a vitrine.</div>
            <ul class="itens">
              @for (p of loja.sacola(); track p.id) {
                <li class="item">
                  <a class="item__foto" [routerLink]="'/produto/' + p.id"><img [src]="'img/' + p.fotos[0] + '.jpg'" alt=""></a>
                  <div class="item__corpo">
                    <div><a class="item__nome" [routerLink]="'/produto/' + p.id">{{ p.nome }}</a><span class="card__meta">Tam. {{ p.tam }} · Peça única</span>
                      <button class="remover" (click)="loja.remover(p)">Remover</button></div>
                    <span class="item__preco">R$ {{ p.preco }}</span>
                  </div>
                </li>
              }
            </ul>
          </section>
          <aside class="resumo">
            <h2>Resumo</h2>
            <label class="campo-label">CEP <input class="campo" #cep maxlength="9" placeholder="00000-000" (change)="buscarCep(cep.value)"></label>
            @if (endereco()) { <p class="msg">{{ endereco() }} · frete R$ {{ frete() }}</p> }
            <label class="campo-label">Cupom <input class="campo" #c placeholder="GARIMPO10" (change)="cupom.set(c.value.toUpperCase())"></label>
            @if (cupom() && !desconto()) { <p class="erro">Cupom inválido.</p> }
            <dl class="resumo__linhas">
              <div><dt>Subtotal</dt><dd>R$ {{ subtotal() }}</dd></div>
              <div><dt>Desconto</dt><dd>− R$ {{ desconto().toFixed(2) }}</dd></div>
              <div><dt>Frete</dt><dd>R$ {{ frete() }}</dd></div>
            </dl>
            <div class="total"><span>Total</span><b>R$ {{ total().toFixed(2) }}</b></div>
            <button class="btn btn--primario btn--bloco" (click)="finalizar()">Finalizar compra →</button>
          </aside>
        </div>
      }
    </div>
  `
})
export class Sacola {
  loja = inject(Loja);
  router = inject(Router);
  agora = signal(Date.now());
  endereco = signal(''); frete = signal(0); cupom = signal(''); pedido = signal('');
  subtotal = computed(() => this.loja.sacola().reduce((s, p) => s + p.preco, 0));
  desconto = computed(() => this.cupom() === 'GARIMPO10' ? this.subtotal() * 0.1 : 0);
  total = computed(() => this.subtotal() - this.desconto() + this.frete());
  tempo = computed(() => {
    const s = Math.max(0, Math.floor((this.loja.reservaAte() - this.agora()) / 1000));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  });
  constructor() { setInterval(() => this.agora.set(Date.now()), 1000); }

  // Endereço pela API ViaCEP; o valor do frete é simulado pela região do CEP.
  buscarCep(cep: string) {
    this.loja.http.get<any>(`https://viacep.com.br/ws/${cep.replace(/\D/g, '')}/json/`).subscribe(r => {
      this.endereco.set(r.erro ? 'CEP não encontrado' : `${r.localidade}/${r.uf}`);
      this.frete.set(r.erro ? 0 : r.uf === 'MG' ? 18.9 : 26.9);
    });
  }
  finalizar() {
    const u = this.loja.usuario();
    if (!u) return this.router.navigate(['/entrar'], { queryParams: { voltar: '/sacola' } });
    const itens = this.loja.sacola();
    const pedido = { usuario: u.id, itens: itens.map(p => p.id), total: this.total(), cupom: this.desconto() ? this.cupom() : '', data: new Date().toISOString().slice(0, 10) };
    return forkJoin([this.loja.http.post<any>(API + 'pedidos', pedido), ...itens.map(p => this.loja.http.patch(API + 'produtos/' + p.id, { vendida: true }))])
      .subscribe(([r]) => { this.pedido.set(r.id); this.loja.sacola.set([]); });
  }
}
