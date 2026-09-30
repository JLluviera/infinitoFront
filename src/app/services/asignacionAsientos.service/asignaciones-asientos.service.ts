import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AsientoMapaDTO } from '../../models/DTOs/AsientoMapaDTO';
import { PasajeroPendienteDTO } from '../../models/DTOs/pasajeroPendienteDTO';
import { AsignarAsientoRequestDTO } from '../../models/DTOs/asignarAsientoRequestDTO';
import { API_URL } from '../../config/api-config.token';
import { MapaExcursionResponseDTO } from '../../models/DTOs/mapaExcursionResponseDTO';
import { DesasignarAsientoDTO } from '../../models/DTOs/desasignarAsientoDTO';

@Injectable({
  providedIn: 'root'
})
export class AsientoService {
  private http = inject(HttpClient);
  private api_Url = inject(API_URL);
  private readonly endpoint = `${this.api_Url}/api/asignaciones`;

  /**
   * Obtiene el mapa completo de asientos para el vehículo de una excursión.
   * C# Endpoint: GET /api/excursiones/{excursionId}/mapa-asientos
   */
  obtenerMapaAsientos(excursionId: number): Observable<MapaExcursionResponseDTO> {
    return this.http.get<MapaExcursionResponseDTO>(`${this.endpoint}/${excursionId}/mapa-asientos`);
  }

  /**
   * Asigna un asiento a un registro ReservaCliente dentro de una excursión.
   * C# Endpoint: POST /api/excursiones/asignar-asiento
   */
  asignarAsiento(payload: AsignarAsientoRequestDTO): Observable<void> {
    return this.http.post<void>(`${this.endpoint}/asignar-asiento`, payload);
  }

  /**
   * (Opcional) Desasigna o libera un asiento previamente ocupado.
   * C# Endpoint: DELETE /api/excursiones/{excursionId}/desasignar-asiento/{asientoId}
   */
  desasignarAsiento(desasignarAsientoDTO: DesasignarAsientoDTO): Observable<string> {
    return this.http.post(`${this.endpoint}/desasignar-asiento}`, desasignarAsientoDTO, { responseType : 'text'});
  }
}