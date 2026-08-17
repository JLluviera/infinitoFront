export interface Destino{
    id: number;
    nombre:string;
    idPais: number;
    ciudad: string;
    descripcion: string;
}
export interface CrearDestino {
  nombre: string;
  ciudad: string;
  idPais: number;
  descripcion: string;
}