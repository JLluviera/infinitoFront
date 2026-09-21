import { Component, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientesService } from '../../../../services/clientes.service/clientes.service';
import { ReservasService } from '../../../../services/reservas.service/reservas.service';

import { Cliente } from '../../../../models/cliente.model';
import { ReservaModel, EstadoReserva } from '../../../../models/reserva.model';

@Component({
  selector: 'app-detalle-cliente',
  imports: [CommonModule],
  templateUrl: './detalle-cliente.html',
  styleUrl: './detalle-cliente.css',
})
export class DetalleClienteComponent {

  private clientesService = inject(ClientesService);
  private reservasService = inject(ReservasService);


  id = input.required<string>();

  cliente = signal<Cliente | null>(null);
  reservas = signal<ReservaModel[]>([]);
  EstadoReserva = EstadoReserva;
  cargando = signal(true);
  error = signal('');

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
}