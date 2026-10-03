import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PaquetesService } from '../../../services/paquetes.service/paquetes.service';
import { DestinoService } from '../../../services/destinos.service/destino.service';
import { PaqueteCrear } from '../../../models/paquete.model';
import { Destino } from '../../../models/destino.model';
import { ModalGenericoComponent } from '../../modal-generico/modal-generico';
import { SelectGenericoComponent } from '../../select-generico/select-generico';

@Component({
  selector: 'app-boton-agregar-paquete',
  imports: [CommonModule,ReactiveFormsModule,ModalGenericoComponent,SelectGenericoComponent],
  templateUrl: './boton-agregar-paquete.html',
  styleUrl: './boton-agregar-paquete.css'
})
export class BotonAgregarPaqueteComponent {

  private formBuilder = inject(FormBuilder);
  private paquetesService = inject(PaquetesService);
  private destinosService = inject(DestinoService);

  @Output() paqueteCreado = new EventEmitter<void>();

  mostrarModal = signal(false);

  destinos = signal<Destino[]>([]);

  paqueteForm = this.formBuilder.nonNullable.group({
    nombre: ['', [
      Validators.required,
      Validators.minLength(2)
    ]],

    precio: [0, [
      Validators.required,
      Validators.min(1)
    ]],

    seña: [0],

    descripcion: ['', [
      Validators.required
    ]],

    idDestino: [0, [
      Validators.required,
      Validators.min(1)
    ]]
  });

  abrirModal(): void {

    this.cargarDestinos();

    this.paqueteForm.reset({
      nombre: '',
      precio: 0,
      seña: 0,
      descripcion: '',
      idDestino: 0
    });

    this.mostrarModal.set(true);
  }

  cerrarModal(): void {
    this.mostrarModal.set(false);
  }

  cargarDestinos(): void {

    this.destinosService.obtenerDestinos().subscribe({
      next: (destinos) => {
        this.destinos.set(destinos);
      },

      error: (error) => {
        console.error('Error al obtener destinos:', error);
      }
    });

  }

  guardar(): void {

    if (this.paqueteForm.invalid) {
      this.paqueteForm.markAllAsTouched();
      return;
    }

    const valores = this.paqueteForm.getRawValue();

    const paquete: PaqueteCrear = {
      nombre: valores.nombre,
      precio: valores.precio,
      seña: valores.seña,
      descripcion: valores.descripcion,
      idDestino: valores.idDestino
    };

    this.paquetesService.crearPaquete(paquete).subscribe({
      next: () => {

        this.cerrarModal();
        this.paqueteCreado.emit();

      },

      error: (error) => {
        console.error('Error al crear el paquete:', error);
      }
    });
  }
  seleccionarDestino(idDestino: number): void {
  this.paqueteForm.patchValue({
    idDestino: idDestino
  });

  this.paqueteForm.get('idDestino')?.markAsTouched();
}
}