import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { API, Loja } from '../loja';

@Component({
  imports: [ReactiveFormsModule],
  template: `
    <div class="wrap pagina dupla">
      <div>
        <span class="rotulo rotulo--azul">Venda com a gente</span>
        <h1 class="titulo-1">Sua peça parada pode ser o achado de alguém.</h1>
        <p class="texto-2">Mande as fotos, a curadoria avalia e responde com uma proposta pelo WhatsApp.</p>
      </div>
      <form class="caixa" [formGroup]="form" (ngSubmit)="enviar()">
        <h2>Enviar peças para avaliação</h2>
        <label class="campo-label">Seu nome <input class="campo" formControlName="nome"></label>
        <label class="campo-label">WhatsApp <input class="campo" formControlName="whats" placeholder="(31) 90000-0000"></label>
        <label class="campo-label">Quais peças? <textarea class="campo" formControlName="pecas"></textarea></label>
        <label class="campo-label">Fotos <input class="campo" type="file" accept="image/*" multiple></label>
        @if (form.invalid && form.touched) { <p class="erro">Preencha nome, WhatsApp e as peças.</p> }
        @if (ok()) { <p class="msg msg--ok">Recebemos sua proposta! Responderemos pelo WhatsApp.</p> }
        <button class="btn btn--primario">Enviar para avaliação</button>
      </form>
    </div>
  `
})
export class Vender {
  loja = inject(Loja);
  ok = signal(false);
  form = inject(FormBuilder).nonNullable.group({
    nome: ['', Validators.required], whats: ['', [Validators.required, Validators.minLength(10)]], pecas: ['', Validators.required]
  });
  enviar() {
    this.form.markAllAsTouched();
    if (this.form.valid) this.loja.http.post(API + 'propostas', { ...this.form.value, status: 'analise' }).subscribe(() => { this.ok.set(true); this.form.reset(); });
  }
}
