import {
  Component,
  EventEmitter,
  Output,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { CrearExcursion } from '../../../models/excursion.model';

import { ExcursionService } from '../../../services/excursiones.service/excursion.service';


@Component({
  selector: 'app-excursion-boton-agregar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './excursion.boton.agregar.component.html'
})

export class ExcursionBotonAgregarComponent {

  private excursionService = inject(ExcursionService);

  private fb = inject(FormBuilder);


  @Output() excursionCreada = new EventEmitter<void>();


  isOpen = signal<boolean>(false);


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

    this.isOpen.set(true);

  }

  cerrarModal(): void {

    this.isOpen.set(false);

    this.excursionForm.reset({
      cantDias: 1,
      cantLugares: 1,
      destinoId: 0
    });

  }


  submitForm(): void {

    if (this.excursionForm.invalid) {

      this.excursionForm.markAllAsTouched();

      return;

    }


    const excursion: CrearExcursion = {

      nombre: this.excursionForm.get('nombre')?.value,

      fechaSalida: this.excursionForm.get('fechaSalida')?.value,

      cantDias: this.excursionForm.get('cantDias')?.value,

      cantLugares: this.excursionForm.get('cantLugares')?.value,

      destinoId: this.excursionForm.get('destinoId')?.value

    };


    this.excursionService.crearExcursion(excursion).subscribe({

      next: (response: any) => {

        console.log(
          'Excursión creada correctamente:',
          response
        );

        this.cerrarModal();

        this.excursionCreada.emit();

      },

      error: (error: any) => {

        console.error(
          'Error al crear excursión:',
          error
        );
      }
    });
  }
}