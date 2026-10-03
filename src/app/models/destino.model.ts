import { Pais } from "./pais.model";
import { Excursion } from "./excursion.model";
import { PaqueteComponent } from "../components/paquete/paquete";

export interface Destino{
    id: number;
    nombre:string;
    idPais: number;
    ciudad: string;
    descripcion: string;
    pais?: Pais;
    excursiones?: Excursion[];
    paquetes?: PaqueteComponent[];
    nombrePais?:string;
}
export interface CrearDestino {
  nombre: string;
  ciudad: string;
  idPais: number;
  descripcion: string;
}