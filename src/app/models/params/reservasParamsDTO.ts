import { EstadoReserva } from "../reserva.model";

export interface ReservaParamsDTO {
    ciCliente? : number;
    estadoReserva? : EstadoReserva;
}