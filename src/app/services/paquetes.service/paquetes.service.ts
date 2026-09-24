import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_URL } from '../../config/api-config.token';
import { Paquete, PaqueteCrear } from '../../models/paquete.model';


@Injectable({
  providedIn: 'root'
})
export class PaquetesService {

  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  private readonly endpoint = `${this.apiUrl}/api/Paquete`;

  obtenerPaquetes(): Observable<Paquete[]> {
    return this.http.get<Paquete[]>(this.endpoint);
  }

  obtenerPaquetePorId(id: number): Observable<Paquete> {
    return this.http.get<Paquete>(`${this.endpoint}/${id}`);
  }

  crearPaquete(paquete: PaqueteCrear): Observable<string> {
    return this.http.post(this.endpoint, paquete, { responseType: 'text' });
  }

  editarPaquete(id: number, paquete: PaqueteCrear): Observable<string> {
    return this.http.put(`${this.endpoint}/${id}`, paquete, { responseType: 'text' });
  }

  eliminarPaquete(id: number): Observable<string> {
    return this.http.delete(`${this.endpoint}/${id}`, { responseType: 'text' });
  }

  getPaquetesDeExcursion(idExcursion: number): Observable<Paquete[]> {
    return this.http.get<Paquete[]>(`${this.endpoint}/excursion/${idExcursion}`);
  }
}