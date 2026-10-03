import { Destino } from "./destino.model";

export interface Pais {
    id: number;
    nombrePais: string;
    codigoPais: string;
    destinos?: Destino[] |null;
}
export interface CrearPais {
    nombrePais: string;
    CodigoPais: string;
}