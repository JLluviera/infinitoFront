import { Destino } from "./destino.model";

export interface Pais {
    id: number;
    nombre: string;
    codigoPais: string;
    destinos: Destino[];
}