import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { API, Loja, Usuario } from '../loja';

@Component({
  imports: [ReactiveFormsModule],
  template: `
    <div class="wrap pagina">
      @if (restrito()) { <div class="aviso">Área restrita. Entre com uma conta de administrador para continuar.</div> }
      @if (loja.usuario(); as u) {
        <div class="caixa"><h1 class="titulo-2">Olá, {{ u.nome }}</h1><p>{{ u.email }} · {{ u.perfil }}</p>
          <button class="btn btn--secundario" (click)="loja.usuario.set(null)">Sair</button></div>
      } @else {
        <div class="caixa">
          <div class="abas">
            <button [class.on]="!cadastro()" (click)="cadastro.set(false)">Entrar</button>
            <button [class.on]="cadastro()" (click)="cadastro.set(true)">Criar conta</button>
          </div>
          <form [formGroup]="form" (ngSubmit)="enviar()" class="caixa" style="padding:0;border:0">
            @if (cadastro()) { <label class="campo-label">Nome <input class="campo" formControlName="nome"></label> }
            <label class="campo-label">E-mail <input class="campo" type="email" formControlName="email"></label>
            <label class="campo-label">Senha <input class="campo" type="password" formControlName="senha"></label>
            @if (erro()) { <p class="erro">{{ erro() }}</p> }
            <button class="btn btn--primario btn--bloco">{{ cadastro() ? 'Criar minha conta' : 'Entrar' }}</button>
            <p class="dica texto-2">Teste: admin&#64;garimpo.com / admin123</p>
          </form>
        </div>
      }
    </div>
  `
})
export class Entrar {
  voltar = input('');
  restrito = input('');
  loja = inject(Loja);
  router = inject(Router);
  cadastro = signal(false);
  erro = signal('');
  form = inject(FormBuilder).nonNullable.group({ nome: [''], email: ['', [Validators.required, Validators.email]], senha: ['', [Validators.required, Validators.minLength(6)]] });

  enviar() {
    const { nome, email, senha } = this.form.getRawValue();
    if (this.form.invalid || (this.cadastro() && !nome)) return this.erro.set('Preencha os campos: e-mail válido e senha com 6 ou mais caracteres.');
    // Cadastro: só cria a conta se o e-mail ainda não existir. Login: busca o usuário com esse e-mail e senha.
    const pedido: Observable<Usuario | Usuario[] | null> = this.cadastro()
      ? this.loja.http.get<Usuario[]>(API + 'usuarios', { params: { email } })
        .pipe(switchMap(r => r.length ? of(null) : this.loja.http.post<Usuario>(API + 'usuarios', { nome, email, senha, perfil: 'cliente' })))
      : this.loja.http.get<Usuario[]>(API + 'usuarios', { params: { email, senha } });
    pedido.subscribe(r => {
      const u = Array.isArray(r) ? r[0] : r;
      if (!u) return this.erro.set(this.cadastro() ? 'Já existe uma conta com esse e-mail.' : 'E-mail ou senha incorretos.');
      this.loja.usuario.set({ id: u.id, nome: u.nome, email: u.email, perfil: u.perfil });
      this.router.navigateByUrl(this.voltar() || (u.perfil === 'admin' ? '/admin' : '/'));
    });
  }
}
