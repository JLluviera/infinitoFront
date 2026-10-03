export interface Cliente {
    id: number;
    nombre: string;
    apellido: string;
    ci: number;
    telefono: string;
    fechaNacimiento:string;
    fechaVencimientoCi:string;
}
export interface CrearCliente {
    nombre: string;
    apellido: string;
    ci: number;
    telefono: string;
    fechaNacimiento:string;
    fechaVencimientoCi:string;
}