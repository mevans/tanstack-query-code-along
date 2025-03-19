import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withRouterConfig,
} from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import {
  provideTanStackQuery,
  QueryClient,
  withDevtools,
} from '@tanstack/angular-query-experimental';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideTanStackQuery(new QueryClient(), withDevtools()),
  ],
};
