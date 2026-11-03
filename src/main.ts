import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { AppRoutingModule } from './app/app-routing.module';

bootstrapApplication(App, {
  providers: [importProvidersFrom(AppRoutingModule)]
}).catch(erro => console.error(erro));
