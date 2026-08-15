export interface Destino{
    id: number;
    nombre:string;
    pais: string;
    ciudad: string;
    descripcion: string;
}
export interface CrearDestino {
  nombre: string;
  ciudad: string;
  pais: string;
  descripcion: string;
}