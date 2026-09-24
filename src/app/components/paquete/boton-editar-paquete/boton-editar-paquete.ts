import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaquetesService } from '../../../services/paquetes.service/paquetes.service';
import { DestinoService } from '../../../services/destinos.service/destino.service';
import { Paquete } from '../../../models/paquete.model';
import { PaqueteCrear } from '../../../models/paquete.model';
import { Destino } from '../../../models/destino.model';
import { ModalGenericoComponent } from '../../modal-generico/modal-generico';
import { SelectGenericoComponent } from '../../select-generico/select-generico';


@Component({
  selector: 'app-boton-editar-paquete',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalGenericoComponent, SelectGenericoComponent],
  templateUrl: './boton-editar-paquete.html',
  styleUrl: './boton-editar-paquete.css'
})
export class BotonEditarPaqueteComponent implements OnChanges {

  private formBuilder = inject(FormBuilder);
  private paquetesService = inject(PaquetesService);
  private destinosService = inject(DestinoService);

  @Input() paquete!: Paquete;

  @Output() paqueteEditado = new EventEmitter<void>();
  @Output() cerrar = new EventEmitter<void>();

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

  constructor() {
    this.cargarDestinos();
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['paquete'] && this.paquete) {

      this.paqueteForm.patchValue({
        nombre: this.paquete.nombre,
        precio: this.paquete.precio,
        seña: this.paquete.seña ?? 0,
        descripcion: this.paquete.descripcion,
        idDestino: this.paquete.idDestino
      });

    }

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
  seleccionarDestino(idDestino: number): void {

    this.paqueteForm.patchValue({
      idDestino: idDestino
    });

    this.paqueteForm.get('idDestino')?.markAsTouched();

  }

  cerrarModal(): void {
    this.cerrar.emit();
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

    this.paquetesService
      .editarPaquete(this.paquete.id, paquete)
      .subscribe({

        next: () => {
          this.paqueteEditado.emit();
        },

        error: (error) => {
          console.error(
            'Error al editar el paquete:',
            error
          );
        }
      });
  }
}