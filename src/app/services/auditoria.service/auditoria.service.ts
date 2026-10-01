import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_URL } from '../../config/api-config.token';
import { Auditoria } from '../../models/auditoria.model.ts';
import { Pagina } from '../../models/pagina';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {

  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  obtenerAuditoriasPaginado(afterId: number | null): Observable<Pagina<Auditoria>> {
    let url = `${this.apiUrl}/api/Auditoria/paginado`;
    if (afterId !== null) {
      url += `?afterId=${afterId}`;
    }
    return this.http.get<Pagina<Auditoria>>(url);
  }
}