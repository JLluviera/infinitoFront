import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrearPlantillaVehiculoDto } from '../../models/crearPlantillaVehiculoDto';
import { PlantillaVehiculo } from '../../models/plantillaVehiculo.model';
import { API_URL } from '../../config/api-config.token';



@Injectable({
  providedIn: 'root'
})
export class PlantillaVehiculoService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);
  private readonly endpoint = `${this.apiUrl}/api/PlantillaVehiculo`

  getPlantillas(): Observable<PlantillaVehiculo[]> {
    return this.http.get<PlantillaVehiculo[]>(this.endpoint);
  }

  getPlantilla(id: number): Observable<PlantillaVehiculo> {
    return this.http.get<PlantillaVehiculo>(`${this.endpoint}/${id}`);
  }

  crearPlantilla(dto: CrearPlantillaVehiculoDto): Observable<string> {
    return this.http.post(`${this.endpoint}`, dto, { responseType: 'text' });
  }
}