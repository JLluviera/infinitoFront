import { Component, EventEmitter, Input, Output, inject, signal, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Excursion, CrearExcursion } from '../../../models/excursion.model';
import { ExcursionService } from '../../../services/excursiones.service/excursion.service';
import { ExcursionBotonAgregarComponent } from "../excursion.boton.agregar.component/excursion.boton.agregar.component";

@Component({
  selector: 'app-excursion-boton-editar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ExcursionBotonAgregarComponent],
  templateUrl: './excursion.boton.editar.html',
  styleUrl: './excursion.boton.editar.css'

})
export class ExcursionBotonEditarComponent implements OnChanges {

  private excursionService = inject(ExcursionService);

  private fb = inject(FormBuilder);


  @Input() excursion: Excursion | null = null;

  @Output() excursionEditada = new EventEmitter<void>();

  @Output() cerrar = new EventEmitter<void>();


  isOpen = signal<boolean>(false);
  ngOnChanges(changes: SimpleChanges): void {

    if (changes['excursion'] && this.excursion) {
      this.abrirModal();
    }
  }

  excursionForm: FormGroup = this.fb.group({

    nombre: [
      '',
      [
        Validators.required,
        Validators.minLength(2)
      ]
    ],

    fechaSalida: [
      '',
      Validators.required
    ],

    cantDias: [
      1,
      [
        Validators.required,
        Validators.min(1)
      ]
    ],

    cantLugares: [
      1,
      [
        Validators.required,
        Validators.min(1)
      ]
    ],

    destinoId: [
      0,
      [
        Validators.required,
        Validators.min(1)
      ]
    ]
  });

  abrirModal(): void {

    if (!this.excursion) {
      return;
    }

    this.excursionForm.patchValue({

      nombre: this.excursion.nombre,

      fechaSalida: this.excursion.fechaSalida,

      cantDias: this.excursion.cantDias,

      cantLugares: this.excursion.cantLugares,

      destinoId: this.excursion.destinoId

    });

    this.isOpen.set(true);
  }

  cerrarModal(): void {

    this.isOpen.set(false);

    this.excursionForm.reset({
      nombre: '',
      fechaSalida: '',
      cantDias: 1,
      cantLugares: 1,
      destinoId: 0
    });

    this.cerrar.emit();
  }

  submitForm(): void {
    if (!this.excursion) {
      return;
    }

    if (this.excursionForm.invalid) {

      this.excursionForm.markAllAsTouched();

      return;
    }


    const excursionModificada: CrearExcursion = {

      nombre: this.excursionForm.get('nombre')?.value,

      fechaSalida: this.excursionForm.get('fechaSalida')?.value,

      cantDias: this.excursionForm.get('cantDias')?.value,

      cantLugares: this.excursionForm.get('cantLugares')?.value,

      destinoId: this.excursionForm.get('destinoId')?.value

    };
    this.excursionService.editarExcursion(this.excursion.id, excursionModificada).subscribe({

      next: (response) => {

        console.log(
          '✅ EXCURSIÓN ACTUALIZADA:',
          response
        );

        this.cerrarModal();

        this.excursionEditada.emit();

      },

      error: (error) => {

        console.error(
          '❌ ERROR AL EDITAR EXCURSIÓN:',
          error
        );

      }

    });

  }

}