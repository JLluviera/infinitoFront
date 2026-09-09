import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { jwtInterceptor } from './interceptors/jwt-interceptor';
// Importamos el environment base y el token
import { environment } from '../environments/environment';
import { API_URL } from './config/api-config.token';

import { respuestasHttpInterceptorfn } from '../app/interceptors/respuestasHttp/respuestas-http.interceptorfn'

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([
      jwtInterceptor,
      respuestasHttpInterceptorfn
    ])),
    
    // Aquí proveemos la URL base de manera global
    { provide: API_URL, useValue: environment.apiUrl }
  ]
};