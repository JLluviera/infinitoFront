import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ModalGenericoComponent } from '../../../modal-generico/modal-generico';

import { TransaccionesService } from '../../../../services/transaccion.service/transacciones.service';
import { Transaccion } from '../../../../models/transaccion.model';
import { TransaccionCrear } from '../../../../models/transaccion.model';
import { FormaDePago,EstadoTransaccion } from '../../../../models/transaccion.model';

@Component({
  selector: 'app-boton-editar-transaccion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalGenericoComponent
  ],
  templateUrl: './boton-editar-transaccion.html',
  styleUrl: './boton-editar-transaccion.css'
})
export class BotonEditarTransaccionComponent implements OnChanges {

  private formBuilder = inject(FormBuilder);
  private transaccionesService = inject(TransaccionesService);

  @Input() transaccion!: Transaccion;

  @Output() transaccionEditada = new EventEmitter<void>();
  @Output() cerrar = new EventEmitter<void>();

  FormaDePago = FormaDePago;
  EstadoTransaccion = EstadoTransaccion;

  transaccionForm = this.formBuilder.nonNullable.group({
    monto: [0, [
      Validators.required,
      Validators.min(1)
    ]],

    fechaCreacion: ['', Validators.required],

    formaDePago: [
      FormaDePago.Efectivo,
      Validators.required
    ],

    observaciones: [''],

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

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['transaccion'] && this.transaccion) {

      this.transaccionForm.patchValue({
        monto: this.transaccion.monto,
        fechaCreacion: this.transaccion.fechaCreacion,
        formaDePago: this.transaccion.formaDePago,
        observaciones: this.transaccion.observaciones,
        estado: this.transaccion.estado,
        idReserva: this.transaccion.idReserva,
        idCliente: this.transaccion.idCliente
      });

    }
  }

  cerrarModal(): void {
    this.cerrar.emit();
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

    this.transaccionesService
      .editarTransaccion(this.transaccion.id, transaccion)
      .subscribe({
        next: () => {
          this.transaccionEditada.emit();
        },

        error: (error) => {
          console.error(
            'Error al editar la transacción:',
            error
          );
        }
      });
  }
}