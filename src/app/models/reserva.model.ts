import { Paquete } from "../components/paquete/paquete";
import { Cliente } from "./cliente.model";
import { Excursion } from "./excursion.model";

export interface ReservaModel {
    id: number;

    fechaReserva: string;

    estadoReserva: EstadoReserva;

    montoTotal: number;

    idClientePagador: number;
    
    clientePagador: Cliente

    idExcursion: number

    excursion: Excursion

    idPaquete: number;

    paquete: Paquete;

    clientesIncluidos: Cliente[];
}


export enum EstadoReserva {
    Pendiente = 0,
    Confirmada = 1,
    Cancelada = 2,
    Anulada = 3
}

export interface ReservaList{
    id: number,
    idExcursion: number,
    nombreCliente: string,
    apellidoCliente: string,
    ciCliente: string
    estadoReserva: EstadoReserva
}