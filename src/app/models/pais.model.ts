import { Destino } from "./destino.model";

export interface Pais {
    id: number;
    nombrePais: string;
    codigoPais: string;
    destinos?: Destino[] |null;
}
export interface PaisCrear {
    nombrePais: string;
    CodigoPais: string;
}