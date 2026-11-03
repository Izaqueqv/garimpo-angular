import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="hero">
      <div>
        <span class="etiqueta">MODA CIRCULAR</span>
        <h1>Uma nova história para cada peça.</h1>
        <p>Encontre roupas e acessórios especiais no nosso brechó. Peças selecionadas, preços acessíveis e consumo consciente.</p>
        <a class="botao" routerLink="/produtos">Ver produtos</a>
      </div>
      <img src="img/jaqueta-jeans.jpg" alt="Jaqueta jeans disponível no Garimpo">
    </section>
    <section class="conteudo">
      <h2>Por que garimpar?</h2>
      <div class="beneficios">
        <article><h3>Peças únicas</h3><p>Produtos selecionados com cuidado.</p></article>
        <article><h3>Preço acessível</h3><p>Moda com qualidade e economia.</p></article>
        <article><h3>Consumo consciente</h3><p>Mais uma chance para roupas que merecem ser usadas.</p></article>
      </div>
    </section>
  `
})
export class Home {}