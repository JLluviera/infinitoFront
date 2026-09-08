import { Injectable, inject, signal, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode'; // Importación de la librería

import { LoginRequest } from '../../models/login.model';
import { AuthResponse } from '../../models/authResponse.model';
import { API_URL } from '../../config/api-config.token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = inject(API_URL);
  
  // Inyectamos NgZone para el rendimiento del temporizador
  private ngZone = inject(NgZone); 
  
  private readonly TOKEN_KEY = 'jwt_token';
  private readonly INACTIVITY_TIME = 60 * 60 * 1000; // 1 hora en milisegundos
  private timeoutId: any;

  // El estado inicial ahora llama a la validación real
  isAuthenticated = signal<boolean>(this.isTokenValid());

  constructor() {
    // Si el usuario recarga la página y ya tiene un token válido, 
    // debemos arrancar el temporizador de inactividad de nuevo.
    if (this.isAuthenticated()) {
      this.setupInactivityListeners();
    }
  }

  /**
   * Envía las credenciales a la API de C#
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/Usuario/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          this.setToken(response.token);
          this.isAuthenticated.set(true); 
          this.setupInactivityListeners(); // Iniciar control de inactividad
        }
      })
    );
  }

  /**
   * Cierra la sesión, limpia temporizadores y redirige
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isAuthenticated.set(false);
    this.clearInactivityListeners(); // Frenar el temporizador
    this.router.navigate(['/login']); 
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // ==========================================
  // LÓGICA DE SEGURIDAD Y VALIDACIÓN
  // ==========================================

  /**
   * Verifica si el token existe, es un JWT válido y no ha expirado
   */
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      // Retorna true solo si tiene fecha de expiración y aún no pasa
      return decoded.exp !== undefined && decoded.exp > currentTime;
    } catch {
      // Si el token es un string inventado o corrupto, falla de forma segura
      return false;
    }
  }

  // ==========================================
  // CONTROL DE INACTIVIDAD
  // ==========================================

  private setupInactivityListeners(): void {
    // Ejecutamos fuera de Angular para no saturar el Change Detection
    this.ngZone.runOutsideAngular(() => {
      ['mousemove', 'keydown', 'click', 'scroll'].forEach(event => {
        window.addEventListener(event, this.resetTimer, true);
      });
      this.resetTimer();
    });
  }

  private clearInactivityListeners(): void {
    ['mousemove', 'keydown', 'click', 'scroll'].forEach(event => {
      window.removeEventListener(event, this.resetTimer, true);
    });
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  // Usamos una arrow function para no perder el contexto de 'this'
  private resetTimer = (): void => {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    
    this.ngZone.runOutsideAngular(() => {
      this.timeoutId = setTimeout(() => {
        // Volvemos a entrar a Angular para ejecutar el logout y actualizar la UI
        this.ngZone.run(() => {
          console.warn('Sesión cerrada por inactividad.');
          this.logout();
        });
      }, this.INACTIVITY_TIME);
    });
  };

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  };

  getUsername(): string | null {
    const token = this.getToken();
    
    // Si no hay token, no hay usuario
    if (!token) return null;

    try {
      // Le pasamos <any> porque vamos a buscar propiedades dinámicas
      const decoded = jwtDecode<any>(token);

      // 1. Buscamos el Claim por defecto de .NET (ClaimTypes.Name)
      const dotNetNameClaim = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
      
      // 2. Buscamos alternativas comunes por si limpiaste los mapeos en C#
      // (a veces viaja como 'unique_name', 'name' o directamente en el 'sub')
      const name = dotNetNameClaim || decoded.unique_name || decoded.name || decoded.sub;

      return name || null;

    } catch (error) {
      console.error('No se pudo extraer el usuario del token', error);
      return null;
    }
  }
}