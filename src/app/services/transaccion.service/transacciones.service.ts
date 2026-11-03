import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_URL } from '../../config/api-config.token';
import { Transaccion } from '../../models/transaccion.model';
import { TransaccionCrear } from '../../models/transaccion.model';
import { TransaccionesParamsDTO } from '../../models/params/transaccionesParamsDTO';

@Injectable({
  providedIn: 'root'
})
export class TransaccionesService {

  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  private readonly endpoint = `${this.apiUrl}/api/Transaccion`;

  // Obtener todas las transacciones
  obtenerTransacciones(filtros? : TransaccionesParamsDTO | null): Observable<Transaccion[]> {
    let url = this.endpoint;
    
    const parametros: string[] = [];

    if (filtros?.apellidoCliente){
      parametros.push(`apellidoCliente=${encodeURIComponent(filtros.apellidoCliente)}`);
    }

    if (filtros?.nombreCliente){
      parametros.push(`nombreCliente=${encodeURIComponent(filtros.nombreCliente)}`);
    }

    if (filtros?.idCliente){
      parametros.push(`idCliente=${filtros.idCliente.toString()}`);
    }

    if (filtros?.idReserva){
      parametros.push(`idReserva=${filtros.idReserva.toString()}`);
    }

    if (parametros.length > 0) {
      url += `?${parametros.join('&')}`;
    }

    return this.http.get<Transaccion[]>(url);
  }

  // Obtener una transacción por ID
  obtenerTransaccionPorId(id: number): Observable<Transaccion> {
    return this.http.get<Transaccion>(`${this.endpoint}/${id}`);
  }

  // Crear una transacción
  crearTransaccion(transaccion: TransaccionCrear): Observable<String> {
    return this.http.post(this.endpoint, transaccion, { responseType: 'text' });
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
