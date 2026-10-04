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