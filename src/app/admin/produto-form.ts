import { Component, effect, inject, input } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { API, CATS, ESTADOS, Loja, Produto } from '../loja';

// Cadastro (rota produto/novo) e edição (rota produto/:id) de peças.
@Component({
  imports: [ReactiveFormsModule],
  template: `
    <h1 class="titulo-1">{{ id() === 'novo' ? 'Nova peça' : 'Editar peça' }}</h1>
    <form class="painel" [formGroup]="form" (ngSubmit)="salvar()">
      <label class="campo-label">Nome <input class="campo" formControlName="nome"></label>
      <label class="campo-label">Marca <input class="campo" formControlName="marca"></label>
      <label class="campo-label">Categoria
        <select class="campo" formControlName="cat">@for (c of cats; track c[0]) { <option [value]="c[0]">{{ c[1] }}</option> }</select></label>
      <label class="campo-label">Tamanho <input class="campo" formControlName="tam"></label>
      <label class="campo-label">Estado
        <select class="campo" formControlName="estado">@for (e of [4, 3, 2, 1]; track e) { <option [ngValue]="e">{{ estados[e] }}</option> }</select></label>
      <label class="campo-label">Preço (R$) <input class="campo" type="number" formControlName="preco"></label>
      <label class="campo-label">Foto (nome do arquivo em public/img) <input class="campo" formControlName="foto"></label>
      <fieldset formArrayName="medidas" class="campo-label">Medidas (cm)
        @for (m of medidas.controls; track m; let i = $index) {
          <div class="medida" [formGroupName]="i">
            <input class="campo" formControlName="0" placeholder="Ex.: Busto"><input class="campo" type="number" formControlName="1">
            <button type="button" class="link-btn" (click)="medidas.removeAt(i)">Remover</button>
          </div>
        }
        <button type="button" class="link-btn" (click)="addMedida()">+ Adicionar medida</button>
      </fieldset>
      <label class="campo-label">Descrição <textarea class="campo" formControlName="desc"></textarea></label>
      <label class="campo-label">Marcas de uso <textarea class="campo" formControlName="uso"></textarea></label>
      @if (form.invalid && form.touched) { <p class="erro">Preencha nome, categoria, tamanho e um preço maior que zero.</p> }
      <button class="btn btn--primario">Salvar</button>
    </form>
  `
})
export class ProdutoForm {
  id = input.required<string>();
  loja = inject(Loja);
  router = inject(Router);
  fb = inject(FormBuilder).nonNullable;
  cats = Object.entries(CATS);
  estados = ESTADOS;
  form = this.fb.group({
    nome: ['', Validators.required], marca: [''], cat: ['', Validators.required], tam: ['', Validators.required], estado: [3],
    preco: [0, Validators.min(1)], foto: ['camiseta-marrom'], desc: [''], uso: [''], medidas: this.fb.array<any>([])
  });
  get medidas() { return this.form.controls.medidas as FormArray; }
  addMedida(nome = '', valor = 0) { this.medidas.push(this.fb.group({ 0: [nome], 1: [valor] })); }

  constructor() {
    // Ao trocar de "editar" para "nova peça" o componente é reaproveitado, então o formulário é limpo antes.
    effect(() => {
      const id = this.id();
      this.form.reset();
      this.medidas.clear();
      if (id !== 'novo') this.loja.http.get<Produto>(API + 'produtos/' + id).subscribe(p => {
        this.form.patchValue({ ...p, foto: p.fotos[0] });
        p.medidas.forEach(m => this.addMedida(...m));
      });
    });
  }
  salvar() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const { foto, medidas, ...v } = this.form.getRawValue();
    const dados = { ...v, fotos: [foto], medidas: medidas.map((m: any) => [m[0], m[1]]) };
    const req = this.id() === 'novo'
      ? this.loja.http.post(API + 'produtos', { ...dados, vendida: false, vintage: false, badge: '', favs: 0 })
      : this.loja.http.patch(API + 'produtos/' + this.id(), dados);
    req.subscribe(() => this.router.navigate(['/admin/produtos']));
  }
}
