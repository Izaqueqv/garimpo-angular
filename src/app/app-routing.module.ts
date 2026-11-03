import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './pages/home';
import { Catalogo } from './pages/catalogo';
import { Gerenciar } from './pages/gerenciar';

const routes: Routes = [
  { path: '', component: Home },
  { path: 'produtos', component: Catalogo },
  { path: 'gerenciar', component: Gerenciar },
  { path: '**', redirectTo: '' }
];

// Módulo responsável pelas rotas da aplicação.
@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
