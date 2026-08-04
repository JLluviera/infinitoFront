import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest } from '../../models/login.model';
import { AuthResponse } from '../../models/authResponse.model';
import { API_URL } from '../../config/api-config.token';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  // 1. Inyección de dependencias moderna (sin constructor)
  private http = inject(HttpClient);
  private router = inject(Router);
  
  // Reemplaza con la URL real de tu API en Azure o tu entorno local
  private readonly apiUrl = inject(API_URL); 
  private readonly TOKEN_KEY = 'jwt_token';

  // 2. Usamos un Signal para el estado. 
  // Al arrancar, revisa si ya hay un token guardado.
  isAuthenticated = signal<boolean>(this.hasToken());

  /**
   * Envía las credenciales a la API de C#
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/Usuario/login`, credentials).pipe(
      // 'tap' nos permite ejecutar una acción secundaria sin modificar la respuesta
      tap(response => {
        if (response && response.token) {
          this.setToken(response.token);
          this.isAuthenticated.set(true); // Actualiza el Signal para toda la app
        }
      })
    );
  }

  /**
   * Cierra la sesión eliminando el token y actualizando el estado
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']); // Redirige a la vista de login
  }

  /**
   * Obtiene el token. Este es el método que llama tu JwtInterceptor.
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // --- Métodos privados auxiliares ---

  private hasToken(): boolean {
    return !!this.getToken();
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }
}