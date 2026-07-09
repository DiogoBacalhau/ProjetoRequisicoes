import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { RecursoLista } from './components/recurso-lista/recurso-lista';
import { RecursoForm } from './components/recurso-form/recurso-form';
import { RequisicaoForm } from './components/requisicao-form/requisicao-form';
import { RequisicaoLista } from './components/requisicao-lista/requisicao-lista';

export const routes: Routes = [
  { path: '', redirectTo: 'app', pathMatch: 'full' },
  { path: 'recursos', component: RecursoLista },
  { path: 'recursos/novo', component: RecursoForm },
  { path: 'recursos/editar/:id', component: RecursoForm },
  { path: 'requisicoes/novo', component: RequisicaoForm },
  { path: 'requisicoes', component: RequisicaoLista }
];

export const config: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient()
  ]
};