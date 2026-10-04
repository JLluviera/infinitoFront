import { Paquete } from "./paquete.model";
import { Destino } from "./destino.model";
import { PlantillaVehiculo } from "./plantillaVehiculo.model";

export interface Excursion {

  id: number;

  nombre: string;

  fechaSalida: string;

  cantDias: number;

  cantLugares: number;

  destinoId: number;

  destino?: Destino;

  plantillaVehiculoId: number;

  plantillaVehiculo: PlantillaVehiculo
}

export interface CrearExcursion {

  nombre: string;

  fechaSalida: string;

  cantDias: number;

  cantLugares: number;

  destinoId: number;

  plantillaVehiculoId: number;
}