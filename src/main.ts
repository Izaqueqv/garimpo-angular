import { LOCALE_ID, importProvidersFrom } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { AppRoutingModule } from './app/app-routing.module';

// Formata moeda e números no padrão brasileiro (R$ 149,00).
registerLocaleData(localePt);

bootstrapApplication(App, {
  providers: [importProvidersFrom(AppRoutingModule), { provide: LOCALE_ID, useValue: 'pt-BR' }]
}).catch(erro => console.error(erro));
