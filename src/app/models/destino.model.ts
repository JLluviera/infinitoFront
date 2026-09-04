import { Pais } from "./pais.model";
import { Excursion } from "./excursion.model";

export interface Destino{
    id: number;
    nombre:string;
    idPais: number;
    ciudad: string;
    descripcion: string;
    pais?: Pais;
    excursiones?: Excursion[];
}
export interface CrearDestino {
  nombre: string;
  ciudad: string;
  idPais: number;
  descripcion: string;
}