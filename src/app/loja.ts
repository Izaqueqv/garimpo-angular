import { Injectable, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CanActivateFn, Router } from '@angular/router';

export const API = 'http://localhost:3000/';
export const ESTADOS = ['', 'Com marcas de uso', 'Bom estado', 'Ótimo estado', 'Nova com etiqueta'];
export const CATS: Record<string, string> = { roupas: 'Roupas', casacos: 'Casacos', acessorios: 'Acessórios', calcados: 'Calçados' };
export interface Produto {
  id: string; nome: string; marca: string; cat: string; tipo: string; tam: string; estado: number; preco: number; fotos: string[];
  medidas: [string, number][]; desc: string; uso: string; vintage: boolean; badge: string; vendida: boolean; favs: number;
}
export interface Usuario { id: string; nome: string; email: string; perfil: 'cliente' | 'admin' }

const ler = (k: string, padrao: any) => JSON.parse(localStorage.getItem('garimpo:' + k) ?? 'null') ?? padrao;

// Estado compartilhado entre as telas: sacola, favoritos e usuário logado (salvos no localStorage).
@Injectable({ providedIn: 'root' })
export class Loja {
  http = inject(HttpClient);
  sacola = signal<Produto[]>(ler('sacola', []));
  reservaAte = signal<number>(ler('reserva', 0));
  favoritos = signal<string[]>(ler('favoritos', []));
  usuario = signal<Usuario | null>(ler('usuario', null));

  constructor() {
    effect(() => {
      const dados = { sacola: this.sacola(), reserva: this.reservaAte(), favoritos: this.favoritos(), usuario: this.usuario() };
      Object.entries(dados).forEach(([k, v]) => localStorage.setItem('garimpo:' + k, JSON.stringify(v)));
    });
  }
  naSacola = (p: Produto) => this.sacola().some(x => x.id === p.id);
  adicionar(p: Produto) {
    if (!this.naSacola(p)) this.sacola.update(s => [...s, p]);
    this.reservaAte.set(Date.now() + 15 * 60000);
  }
  remover = (p: Produto) => this.sacola.update(s => s.filter(x => x.id !== p.id));
  favorito = (p: Produto) => this.favoritos().includes(p.id);
  favoritar = (p: Produto) => this.favoritos.update(f => this.favorito(p) ? f.filter(id => id !== p.id) : [...f, p.id]);
}

// Proteção de rotas: o painel só abre para administrador; os outros vão para o login.
export const admin: CanActivateFn = (_, estado) =>
  inject(Loja).usuario()?.perfil === 'admin' || inject(Router).createUrlTree(['/entrar'], { queryParams: { voltar: estado.url, restrito: 1 } });
