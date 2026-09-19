import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_URL } from '../../config/api-config.token';
import { Transaccion } from '../../models/transaccion.model';
import { TransaccionCrear } from '../../models/transaccion.model';

@Injectable({
  providedIn: 'root'
})
export class TransaccionesService {

  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  private readonly endpoint = `${this.apiUrl}/api/Transaccion`;

  // Obtener todas las transacciones
  obtenerTransacciones(): Observable<Transaccion[]> {
    return this.http.get<Transaccion[]>(this.endpoint);
  }

  // Obtener una transacción por ID
  obtenerTransaccionPorId(id: number): Observable<Transaccion> {
    return this.http.get<Transaccion>(`${this.endpoint}/${id}`);
  }

  // Crear una transacción
  crearTransaccion(transaccion: TransaccionCrear): Observable<Transaccion> {
    return this.http.post<Transaccion>(this.endpoint, transaccion);
  }

  // Editar una transacción
  editarTransaccion(
    id: number,
    transaccion: TransaccionCrear
  ): Observable<string> {
    return this.http.put(
      `${this.endpoint}/${id}`,
      transaccion,
      { responseType: 'text' }
    );
  }

  // Eliminar una transacción
  eliminarTransaccion(id: number): Observable<string> {
    return this.http.delete(
      `${this.endpoint}/${id}`,
      { responseType: 'text' }
    );
  }
}
