import { TipoAsiento } from "../asiento.model";

export interface AsientoMapaDTO {
  id: number;
  numeroAsiento: string;
  pisoAsiento: number;
  fila: number;
  columna: number;
  tipoAsiento: TipoAsiento;
  ocupado: boolean;
  reservaClienteId?: number | null;
  nombreCliente?: string | null;
}