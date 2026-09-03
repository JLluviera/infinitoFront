import { Paquete } from "../components/paquete/paquete";
import { Destino } from "./destino.model";

export interface Excursion {

  id: number;

  nombre: string;

  fechaSalida: string;

  cantDias: number;

  cantLugares: number;

  destinoId: number;

  destino?: Destino;

  paquetes?: Paquete[];
}

export interface CrearExcursion {

  nombre: string;

  fechaSalida: string;

  cantDias: number;

  cantLugares: number;

  destinoId: number;
}