import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { authConfig } from './auth/auth.config';
import { AuthInterceptor, provideAuth } from 'angular-auth-oidc-client';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),provideAnimationsAsync(),
    providePrimeNG({
        theme: {
            preset: Aura
        }
    }),provideHttpClient(), provideAuth(authConfig), { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }]
};
