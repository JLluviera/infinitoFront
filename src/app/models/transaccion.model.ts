import { FormsModule } from "@angular/forms";
import { Cliente } from "./cliente.model";
import { ReservaModel } from "./reserva.model";

export interface Transaccion {
    id: number;
    monto: number;
    fechaCreacion: string;
    formaDePago: FormaDePago;
    observaciones: string;
    estado: EstadoTransaccion;
    idReserva: number;
    idCliente: number;
    nombreCliente?: string;
    nombreEstado?: string;
    nombreFormaPago?:string;
}
export interface TransaccionCrear {
    monto: number;
    fechaCreacion: string;
    formaDePago: FormaDePago;
    observaciones: string;
    estado: EstadoTransaccion;
    idReserva: number;
    idCliente: number;

}

export enum FormaDePago {
    Efectivo = 0,
    TarjetaDebito = 1,
    TarjetaCredito = 2,
    Transferencia = 3
}

export enum EstadoTransaccion {
    Pendiente = 0,
    Finalizado = 1
}
