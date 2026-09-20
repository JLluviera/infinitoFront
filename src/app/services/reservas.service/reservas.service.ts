import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '../../config/api-config.token';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ReservaList, ReservaModel } from '../../models/reserva.model';
import { ReservaCrearModel } from '../../models/reserva-crear.model';

@Injectable({
  providedIn: 'root',
})
export class ReservasService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);
  private router = inject(Router);

  getReservas(): Observable<ReservaModel[]> {
    return this.http.get<ReservaModel[]>(`${this.apiUrl}/api/Reserva`);
  }

  getReservaPorId(id: number): Observable<ReservaModel> {
    return this.http.get<ReservaModel>(`${this.apiUrl}/api/${id}`);
  }

  postReserva(reserva: ReservaCrearModel): Observable<string> {
    return this.http.post(`${this.apiUrl}/api/Reserva`, reserva, { responseType: 'text'});
  }

  deleteReserva(id: number): Observable<string>{
    return this.http.delete(`${this.apiUrl}/api/Reserva/${id}`, { responseType: 'text'});
  }

  getReservasCliente(ci: number): Observable<ReservaModel[]> {
    return this.http.get<ReservaModel[]>(`${this.apiUrl}/api/Reserva/cliente/${ci}`)
  }

  getReservasExcursiones(idExcursion: number): Observable<ReservaList[]>{
    return this.http.get<ReservaList[]>(`${this.apiUrl}/api/Reserva/excursion/${idExcursion}`)
  }

  getReservasList(): Observable<ReservaList[]>{
    return this.http.get<ReservaList[]>(`${this.apiUrl}/api/Reserva/list`)

  }
}
