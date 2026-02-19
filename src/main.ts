import { bootstrapApplication } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import esLocale from '@angular/common/locales/es';
import { appConfig } from './app/app.config';
import { App } from './app/app';

registerLocaleData(esLocale);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
