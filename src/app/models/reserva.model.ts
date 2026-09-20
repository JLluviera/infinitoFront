import { Paquete } from "../components/paquete/paquete";
import { Cliente } from "./cliente.model";
import { Excursion } from "./excursion.model";

export interface ReservaModel {
    id: number;

    fechaReserva: string;

    EstadoReserva: EstadoReserva;

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
    Pendiente = 'Pendiente',
    Confirmada = 'Confirmada',
    Cancelada = 'Cancelada',
    Anulada = 'Anulada'
}

export interface ReservaList{
    id: number,
    idExcursion: number,
    nombreCliente: string,
    apellidoCliente: string,
    ciCliente: string
    estadoReserva: EstadoReserva
}