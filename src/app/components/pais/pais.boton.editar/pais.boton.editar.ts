import { Component, EventEmitter, Input, Output, inject, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Pais } from '../../../models/pais.model';
import { PaisCrear } from '../../../models/paisCrear.model';
import { PaisesService } from '../../../services/paises.service/paises.service';
import { ModalGenericoComponent } from '../../modal-generico/modal-generico';
@Component({
  selector: 'app-pais-boton-editar',
  standalone: true,

  imports: [CommonModule, ReactiveFormsModule, ModalGenericoComponent],

  templateUrl: './pais.boton.editar.html',
  styleUrl: './pais.boton.editar.css'
})
export class PaisBotonEditarComponent implements OnChanges {

  private paisesService = inject(PaisesService);
  private fb = inject(FormBuilder);
  @Input() pais: Pais | null = null;
  @Output() paisEditado = new EventEmitter<void>();
  @Output() cerrar = new EventEmitter<void>();

  mostrarModal = false;


  paisForm: FormGroup = this.fb.group({

    nombre: [
      '',
      [
        Validators.required,
        Validators.minLength(2)
      ]
    ],

    codigo: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(5)
      ]
    ]

  });


  ngOnChanges(changes: SimpleChanges): void {

    if (changes['pais'] && this.pais) {

      this.paisForm.patchValue({

        nombre: this.pais.nombrePais,

        codigo: this.pais.codigoPais

      });

      this.mostrarModal = true;

    }

  }


  cerrarModal(): void {

    this.mostrarModal = false;

    this.paisForm.reset();

    this.cerrar.emit();

  }


  submitForm(): void {

    if (!this.pais) {
      return;
    }

    if (this.paisForm.invalid) {

      this.paisForm.markAllAsTouched();

      return;

    }


    const paisModificado: PaisCrear = {

      Nombre: this.paisForm.get('nombre')?.value,

      CodigoPais: this.paisForm.get('codigo')?.value

    };


    console.log('📦 PAÍS A EDITAR:', paisModificado);

    console.log('🆔 ID:', this.pais.id);


    this.paisesService.editPais(this.pais.id, paisModificado).subscribe({

      next: (paisActualizado) => {

        console.log(
          '✅ PAÍS ACTUALIZADO:',
          paisActualizado
        );

        this.mostrarModal = false;

        this.paisEditado.emit();

      },

      error: (error) => {

        console.error(
          '❌ ERROR AL EDITAR PAÍS:',
          error
        );

      }

    });

  }

}

