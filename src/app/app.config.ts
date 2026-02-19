import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // // Optimización de change detection (nuevo en v18+)
    // provideZoneChangeDetection({ eventCoalescing: true }),

    // Router con animaciones de transición entre páginas
    provideRouter(routes, withViewTransitions()),

    // HttpClient disponible en toda la app (para llamar a Supabase)
    provideHttpClient(withInterceptorsFromDi()),
  ]
};
