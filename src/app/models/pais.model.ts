import { Destino } from "./destino.model";

export interface Pais {
    id: number;
    nombre: string;
    codigoPais: string;
    destinos: Destino[];
}
export interface PaisCrear {
    Nombre: string;
    CodigoPais: String;
}