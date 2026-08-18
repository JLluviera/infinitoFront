import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../config/api-config.token';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service/auth.service';
import { PaisCrear } from '../../models/paisCrear.model';

import { Pais } from '../../models/pais.model';
import { Destino } from '../../models/destino.model';

@Injectable({
  providedIn: 'root',
})
export class PaisesService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);
  private router = inject(Router);
  private authService = inject(AuthService);

  getPaises(): Observable<Pais[]> {
    return this.http.get<Pais[]>(`${this.apiUrl}/api/Paises`);
  }

  getPaisPorId(id:number): Observable<Pais> {
    return this.http.get<Pais>(`${this.apiUrl}/api/Paises/${id}`);
  }

  postPais(pais: PaisCrear): Observable<Pais> {
    return this.http.post<Pais>(`${this.apiUrl}/api/Paises`, pais);
  }
}
