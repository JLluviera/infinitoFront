export interface Asiento {
    id?: number;
    numeroAsiento: string;
    pisoAsiento: number;
    fila: number;
    columna: number;
    tipoAsiento: TipoAsiento;
}

export enum TipoAsiento{
    Standard = "Standard",
    Cama = "Cama",
    Vacio = "Vacio"
}

export interface AsignacionActual {
  id: number;
  reservaClienteId: number;
  nombreCliente: string;
  apellidoCliente: string;
  numeroAsiento: string;
  pisoAsiento: number;
}