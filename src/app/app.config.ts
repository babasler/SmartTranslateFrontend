import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authConfig } from './auth/auth.config';
import { provideAuth } from 'angular-auth-oidc-client';
import { authInterceptorFn } from './auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),provideAnimationsAsync(),
    providePrimeNG({
        theme: {
            preset: Aura
        }
    }),provideHttpClient(withInterceptors([authInterceptorFn])), provideAuth(authConfig), ]
};
