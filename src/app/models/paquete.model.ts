import { Destino } from "./destino.model";

export interface PaqueteModel {
    IdPaquete: number;
    IdDestino: number;
    Nombre: string;
    Descripcion: string;
    Precio: number;
    Senia: number;
    Destino: Destino;
}
