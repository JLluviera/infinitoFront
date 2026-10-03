import { Component, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientesService } from '../../../../services/clientes.service/clientes.service';
import { ReservasService } from '../../../../services/reservas.service/reservas.service';
import { Cliente } from '../../../../models/cliente.model';
import { ReservaModel, EstadoReserva } from '../../../../models/reserva.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalle-cliente',
  imports: [CommonModule],
  templateUrl: './detalle-cliente.html',
  styleUrl: './detalle-cliente.css',
})
export class DetalleClienteComponent {

  private clientesService = inject(ClientesService);
  private reservasService = inject(ReservasService);
  private router= inject(Router);

  id = input.required<string>();

  saldoPendiente = signal<number>(0);
  deudaCliente = signal<number>(0);
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

  cedulaVencida(fecha: string | undefined): boolean{
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

  obtenerSaldoCliente(id: number){
    this.clientesService.obtenerSaldoPendienteCliente(id).subscribe({
      next: (resp: any) =>{
        this.saldoPendiente.set(resp);
      }
    })
  }

  obtenerDeudaCliente(id: number){
    this.clientesService.obtenerDeudaCliente(id).subscribe({
      next: (resp: any) => {
        this.deudaCliente.set(resp);
      }
    })
  }
}