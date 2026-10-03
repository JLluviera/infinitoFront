import { Destino } from "./destino.model";

export interface Paquete {
  id: number;
  idDestino: number;
  nombre: string;
  precio: number;
  seña: number | null;
  descripcion: string;
  nombreDestino?: string;
}

export interface PaqueteCrear {
  nombre: string;
  precio: number;
  seña: number | null;
  descripcion: string;
  idDestino: number;
}
