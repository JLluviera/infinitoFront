import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../config/api-config.token';
import { Observable } from 'rxjs';
import { Destino,CrearDestino } from '../../models/destino.model';

@Injectable({
  providedIn: 'root',
})
export class DestinoService {

  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  private readonly endpoint = `${this.apiUrl}/api/Destino`;

  obtenerDestinos(): Observable<Destino[]> {
    return this.http.get<Destino[]>(this.endpoint);
  }

  obtenerDestinoPorId(id: number): Observable<Destino> {
    return this.http.get<Destino>(`${this.endpoint}/${id}`);
  }

  crearDestino(nuevoDestino: CrearDestino): Observable<Destino> {
  return this.http.post<Destino>(this.endpoint, nuevoDestino);
}

  editarDestino(id: number, destino: Destino): Observable<Destino> {
    return this.http.put<Destino>(`${this.endpoint}/${id}`, destino);
  }

  eliminarDestino(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}