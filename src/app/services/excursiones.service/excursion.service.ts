import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../config/api-config.token';
import { Observable } from 'rxjs';
import { Excursion, CrearExcursion } from '../../models/excursion.model';

@Injectable({
  providedIn: 'root',
})

export class ExcursionService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  private readonly endpoint = `${this.apiUrl}/api/Excursiones`;

  obtenerExcursiones(): Observable<Excursion[]> {
    return this.http.get<Excursion[]>(this.endpoint);
  }
  obtenerExcursionPorId(id: number): Observable<Excursion> {
    return this.http.get<Excursion>(`${this.endpoint}/${id}`);
  }
  crearExcursion(nuevaExcursion: CrearExcursion): Observable<string> {
    return this.http.post(this.endpoint, nuevaExcursion,{responseType:'text'});
  }
  editarExcursion(id: number,excursion: CrearExcursion): Observable<string> {
    return this.http.put(`${this.endpoint}/${id}`, excursion,{ responseType: 'text' });
  }
  borrarExcursion(id: number): Observable<string> {
    return this.http.delete(`${this.endpoint}/${id}`,{ responseType: 'text' });
  }
}
