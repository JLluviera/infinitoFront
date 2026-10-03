import { TipoAsiento } from "./asiento.model";

export interface CrearAsientoDto {
  numeroAsiento: string;
  pisoAsiento: number;
  fila: number;
  columna: number;
  tipoAsiento: TipoAsiento;
}