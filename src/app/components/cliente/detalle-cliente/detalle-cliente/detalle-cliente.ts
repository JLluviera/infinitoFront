import { Component, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientesService } from '../../../../services/clientes.service/clientes.service';
import { ReservasService } from '../../../../services/reservas.service/reservas.service';
import { Cliente } from '../../../../models/cliente.model';
import { ReservaModel, EstadoReserva } from '../../../../models/reserva.model';
import { Router } from '@angular/router';
import { ModalGenericoComponent } from '../../../modal-generico/modal-generico';

@Component({
  selector: 'app-detalle-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalGenericoComponent],
  templateUrl: './detalle-cliente.html',
  styleUrl: './detalle-cliente.css',
})
export class DetalleClienteComponent {

  private clientesService = inject(ClientesService);
  private reservasService = inject(ReservasService);
  private router = inject(Router);


  id = input.required<string>();
  saldoPendiente = signal<number>(0);
  deudaCliente = signal<number>(0);
  cliente = signal<Cliente | null>(null);
  reservas = signal<ReservaModel[]>([]);
  EstadoReserva = EstadoReserva;
  cargando = signal(true);
  error = signal('');
  reservaSeleccionada = signal<ReservaModel | null>(null);
  mostrarModalSaldo = signal(false);
  montoSaldo = signal(0);


  constructor() {

    effect(() => {

      const idCliente = Number(this.id());

      if (!idCliente || idCliente <= 0) {
        this.error.set('ID de cliente inválido');
        this.cargando.set(false);
        return;
      }

      this.obtenerCliente(idCliente);

    });

  }

  obtenerCliente(id: number): void {

    this.clientesService.obtenerClientePorId(id).subscribe({
      next: (cliente) => {

        this.cliente.set(cliente);
        this.obtenerReservas(cliente.ci);
        this.obtenerSaldoCliente(cliente.id);
        this.obtenerDeudaCliente(cliente.id);

        this.cargando.set(false);
      },

      error: (error) => {

        console.error('Error al obtener el cliente:', error);

        this.error.set('No se pudo obtener el cliente');
        this.cargando.set(false);

      }
    });

  }

  obtenerReservas(ci: number): void {

    this.reservasService.getReservasCliente(ci).subscribe({

      next: (reservas) => {
        this.reservas.set(reservas);
      },

      error: (error) => {

        console.error('Error al obtener las reservas:', error);

        this.reservas.set([]);

      }

    });

  }

  obtenerNombreEstado(estado: EstadoReserva): string {
    return EstadoReserva[estado];
  }

  cedulaVencida(fecha: string | undefined): boolean {
    if (!fecha) return false;
    const fechaVenc = new Date(fecha);
    const hoy = new Date();
    // Reseteamos horas para comparar solo la fecha
    hoy.setHours(0, 0, 0, 0);
    return fechaVenc < hoy;
  }

  volver(): void {
    this.router.navigate(['/clientes']);
  }

  obtenerSaldoCliente(id: number) {
    this.clientesService.obtenerSaldoPendienteCliente(id).subscribe({
      next: (resp: any) => {
        this.saldoPendiente.set(resp);
      }
    })
  }

  obtenerDeudaCliente(id: number) {
    this.clientesService.obtenerDeudaCliente(id).subscribe({
      next: (resp: any) => {
        this.deudaCliente.set(resp);
      }
    })
  }
  abrirUsarSaldo(reserva: ReservaModel): void {
    this.reservaSeleccionada.set(reserva);
    this.montoSaldo.set(0);
    this.mostrarModalSaldo.set(true);
  }

  cerrarUsarSaldo(): void {
    this.mostrarModalSaldo.set(false);
    this.reservaSeleccionada.set(null);
    this.montoSaldo.set(0);
  }
  usarSaldo(): void {

  const reserva = this.reservaSeleccionada();
  const clienteActual = this.cliente();

  if (!reserva || !clienteActual) {
    return;
  }

  const monto = this.montoSaldo();

  if (monto <= 0) {
    return;
  }

  if (monto > this.saldoPendiente()) {
    return;
  }

  if (monto > reserva.montoTotal) {
    return;
  }

  this.clientesService.usarSaldo(clienteActual.id,reserva.id,monto).subscribe({ next: () => {

        console.log('Saldo utilizado correctamente');

        this.cerrarUsarSaldo();

        // Actualizamos saldo y deuda
        this.obtenerSaldoCliente(clienteActual.id);
        this.obtenerDeudaCliente(clienteActual.id);

        // Recargamos las reservas
        this.obtenerReservas(clienteActual.ci);
      },

      error: (error) => {

        console.error(
          'Error al utilizar el saldo:',
          error
        );

      }
    });
}
}