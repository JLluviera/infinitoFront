import { Component, inject, signal } from '@angular/core';

import { TransaccionesService } from '../../services/transaccion.service/transacciones.service';
import { Transaccion } from '../../models/transaccion.model';

import { ListaGenericaComponent, ColumnaTabla } from '../lista-generica.component/lista-generica.component';
import { from } from 'rxjs';
import { BotonAgregarTransaccionComponent } from './boton-agregar-transaccion/boton-agregar-transaccion';
import { BotonEditarTransaccionComponent } from './boton-editar-transaccion/boton-editar-transaccion/boton-editar-transaccion';
import { PaisBotonEditarComponent } from '../pais/pais.boton.editar/pais.boton.editar';

@Component({
  selector: 'app-transaccion',
  imports: [ListaGenericaComponent, BotonAgregarTransaccionComponent, BotonEditarTransaccionComponent],
  templateUrl: './transaccion.html',
  styleUrl: './transaccion.css',
})
export class TransaccionComponent {

  private transaccionesService = inject(TransaccionesService);

  transacciones = signal<Transaccion[]>([]);
  transaccionSeleccionada: Transaccion | null = null;
  mostrarEdicion = false;

  columnas: ColumnaTabla<Transaccion>[] = [
    { header: 'ID', field: 'id', tipo: 'id' },
    { header: 'Monto', field: 'monto', tipo: 'texto' },
    { header: 'Fecha', field: 'fechaCreacion', tipo: 'texto' },
    { header: 'Forma de pago', field: 'formaDePago', tipo: 'texto' },
    { header: 'Estado', field: 'estado', tipo: 'texto' },
    { header: 'Reserva', field: 'idReserva', tipo: 'id' },
    { header: 'Cliente', field: 'idCliente', tipo: 'id' },
  ];

  constructor() {
    this.obtenerTransacciones();
  }

  obtenerTransacciones(): void {
    this.transaccionesService.obtenerTransacciones().subscribe({
      next: (transacciones) => {
        this.transacciones.set(transacciones);
      },
      error: (error) => {
        console.error('Error al obtener las transacciones:', error);
      }
    });
  }

  recargarTransacciones(): void {
    this.obtenerTransacciones();
  }

  eliminarTransaccion(transaccion: Transaccion): void {
    const confirmar = confirm(
      `¿Desea eliminar la transacción con ID ${transaccion.id}?`
    );

    if (!confirmar) {
      return;
    }

    this.transaccionesService.eliminarTransaccion(transaccion.id).subscribe({
      next: () => {
        this.obtenerTransacciones();
      },
      error: (error) => {
        console.error('Error al eliminar la transacción:', error);
      }
    });
  }
  editarTransaccion(transaccion: Transaccion): void {
  this.transaccionSeleccionada = transaccion;
  this.mostrarEdicion = true;
}

cerrarEdicion(): void {
  this.mostrarEdicion = false;
  this.transaccionSeleccionada = null;
}

finalizarEdicion(): void {
  this.cerrarEdicion();
  this.obtenerTransacciones();
}
}