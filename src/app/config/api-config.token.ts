import { InjectionToken } from '@angular/core';

// Creamos un token que representará un string (nuestra URL base)
export const API_URL = new InjectionToken<string>('API_URL');