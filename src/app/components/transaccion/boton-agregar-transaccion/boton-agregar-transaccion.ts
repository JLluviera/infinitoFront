import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalGenericoComponent } from '../../modal-generico/modal-generico';
import { TransaccionesService } from '../../../services/transaccion.service/transacciones.service';
import { ReservasService } from '../../../services/reservas.service/reservas.service';
import { ClientesService } from '../../../services/clientes.service/clientes.service';
import { TransaccionCrear } from '../../../models/transaccion.model';
import {FormaDePago,EstadoTransaccion} from '../../../models/transaccion.model';
import { ReservaModel } from '../../../models/reserva.model';
import { Cliente } from '../../../models/cliente.model';

@Component({
  selector: 'app-boton-agregar-transaccion',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,ModalGenericoComponent],
  templateUrl: './boton-agregar-transaccion.html',
  styleUrl: './boton-agregar-transaccion.css'
})
export class BotonAgregarTransaccionComponent {

  private formBuilder = inject(FormBuilder);
  private transaccionesService = inject(TransaccionesService);
  private reservasService = inject(ReservasService);
  private clientesService = inject(ClientesService);

  @Output() transaccionCreada = new EventEmitter<void>();

  mostrarModal = signal(false);

  reservas = signal<ReservaModel[]>([]);
  clientes = signal<Cliente[]>([]);

  // Hacemos los enums accesibles desde el HTML
  FormaDePago = FormaDePago;
  EstadoTransaccion = EstadoTransaccion;

  transaccionForm = this.formBuilder.nonNullable.group({
    monto: [0, [
      Validators.required,
      Validators.min(1)
    ]],

    fechaCreacion: [
      new Date().toISOString().split('T')[0],
      Validators.required
    ],

    formaDePago: [
      FormaDePago.Efectivo,
      Validators.required
    ],

    observaciones: [
      ''
    ],

    estado: [
      EstadoTransaccion.Pendiente,
      Validators.required
    ],

    idReserva: [
      0,
      [
        Validators.required,
        Validators.min(1)
      ]
    ],

    idCliente: [
      0,
      [
        Validators.required,
        Validators.min(1)
      ]
    ]
  });

  abrirModal(): void {

    this.cargarReservas();
    this.cargarClientes();

    this.transaccionForm.reset({
      monto: 0,
      fechaCreacion: new Date().toISOString().split('T')[0],
      formaDePago: FormaDePago.Efectivo,
      observaciones: '',
      estado: EstadoTransaccion.Pendiente,
      idReserva: 0,
      idCliente: 0
    });

    this.mostrarModal.set(true);
  }

  cerrarModal(): void {
    this.mostrarModal.set(false);
  }

  cargarReservas(): void {
    this.reservasService.getReservas().subscribe({
      next: (reservas) => {
        this.reservas.set(reservas);
      },
      error: (error) => {
        console.error('Error al obtener las reservas:', error);
      }
    });
  }

  cargarClientes(): void {
    this.clientesService.obtenerClientes().subscribe({
      next: (clientes) => {
        this.clientes.set(clientes);
      },
      error: (error) => {
        console.error('Error al obtener los clientes:', error);
      }
    });
  }

  guardar(): void {

    if (this.transaccionForm.invalid) {
      this.transaccionForm.markAllAsTouched();
      return;
    }

    const valores = this.transaccionForm.getRawValue();

    const transaccion: TransaccionCrear = {
      monto: valores.monto,
      fechaCreacion: valores.fechaCreacion,
      formaDePago: valores.formaDePago,
      observaciones: valores.observaciones,
      estado: valores.estado,
      idReserva: valores.idReserva,
      idCliente: valores.idCliente
    };

    this.transaccionesService.crearTransaccion(transaccion).subscribe({
      next: () => {
        this.cerrarModal();
        this.transaccionCreada.emit();
      },

      error: (error) => {
        console.error('Error al crear la transacción:', error);
      }
    });
  }
}