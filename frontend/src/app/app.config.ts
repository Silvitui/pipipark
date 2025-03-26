import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [BrowserAnimationsModule,provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), HttpClient, provideHttpClient()]
};
