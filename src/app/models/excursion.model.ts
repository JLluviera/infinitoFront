import { Paquete } from "./paquete.model";
import { Destino } from "./destino.model";

export interface Excursion {

  id: number;

  nombre: string;

  fechaSalida: string;

  cantDias: number;

  cantLugares: number;

  destinoId: number;

  destino?: Destino;
}

export interface CrearExcursion {

  nombre: string;

  fechaSalida: string;

  cantDias: number;

  cantLugares: number;

  destinoId: number;
}