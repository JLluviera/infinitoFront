import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cliente, CrearCliente } from '../../models/cliente.model';
import { Observable } from 'rxjs';
import { API_URL } from '../../config/api-config.token';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  private readonly endpoint = `${this.apiUrl}/api/Cliente`;

  obtenerClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.endpoint);
  }

  obtenerClientePorId(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }
  crearCliente(nuevoCliente: CrearCliente): Observable<string> {
    return this.http.post(this.endpoint, nuevoCliente, { responseType: 'text' });
  }

  editarCliente(id: number, cliente: CrearCliente): Observable<string> {
    return this.http.put(`${this.endpoint}/${id}`, cliente, { responseType: 'text' });
  }
  borrarCliente(id: number): Observable<string> {
    return this.http.delete(`${this.endpoint}/${id}`, { responseType: 'text' });
  }
}
