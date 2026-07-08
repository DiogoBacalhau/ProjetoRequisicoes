import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { RecursoLista } from './components/recurso-lista/recurso-lista';
import { RecursoForm } from './components/recurso-form/recurso-form';

export const routes: Routes = [
  { path: '', redirectTo: 'recursos', pathMatch: 'full' },
  { path: 'recursos', component: RecursoLista },
  { path: 'recursos/novo', component: RecursoForm },
  { path: 'recursos/editar/:id', component: RecursoForm }
];

export const config: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient()
  ]
};