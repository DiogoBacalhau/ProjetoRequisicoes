import { Routes } from '@angular/router';
import { RecursoLista } from './components/recurso-lista/recurso-lista';
import { RecursoForm } from './components/recurso-form/recurso-form';
import { RequisicaoForm } from './components/requisicao-form/requisicao-form';
import { RequisicaoLista } from './components/requisicao-lista/requisicao-lista';
import { LoginComponent } from './components/login/login';
import { RegistoComponent } from './components/registo/registo';
import { authGuard, adminGuard } from './app.guards';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'recursos', component: RecursoLista, canActivate: [authGuard] },
  { path: 'requisicoes/novo', component: RequisicaoForm, canActivate: [authGuard] },
  { path: 'requisicoes', component: RequisicaoLista, canActivate: [authGuard] },
  { path: 'recursos/novo', component: RecursoForm, canActivate: [authGuard] },
  { path: 'recursos/editar/:id', component: RecursoForm, canActivate: [authGuard, adminGuard] },
  { path: 'registo', component: RegistoComponent, canActivate: [authGuard, adminGuard] }
];