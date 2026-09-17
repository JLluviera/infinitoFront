import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '../config/api-config.token';
import { Paquete } from '../components/paquete/paquete';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaquetesService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  private readonly endpoint = `${this.apiUrl}/api/Paquete`;

  getPaquetesDeExcursion(idExcursion: number) : Observable<Paquete[]> {
    return this.http.get<Paquete[]>(`${this.endpoint}/excursion/${idExcursion}`);
  }
}
