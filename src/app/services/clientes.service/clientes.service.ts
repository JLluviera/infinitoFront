import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../../models/cliente.model';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private http = inject(HttpClient);
  private apiUrl = 'URL_API_ENA_AZURE';

  getClientes(): Observable<Cliente[]>{
    return this.http.get<Cliente[]>(`${this.apiUrl}/clientes`);
  }
}
