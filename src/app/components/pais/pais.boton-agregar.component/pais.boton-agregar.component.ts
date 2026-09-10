import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaisCrear } from '../../../models/paisCrear.model';
import { PaisesService } from '../../../services/paises.service/paises.service';
import { ModalGenericoComponent } from '../../modal-generico/modal-generico';

@Component({
  selector: 'app-boton-agregar-pais',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,ModalGenericoComponent],
  templateUrl: './pais.boton-agregar.component.html'
})
export class PaisBotonAgregarComponent {

  private paisesService = inject(PaisesService);
  private fb = inject(FormBuilder);

  @Output() paisCreado = new EventEmitter<void>();

  isOpen = signal<boolean>(false);

  paisForm: FormGroup = this.fb.group({
    nombre: ['', [
      Validators.required,
      Validators.minLength(2)
    ]],

    codigo: ['', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(5)
    ]]
  });

  abrirModal(): void {
    this.isOpen.set(true);
  }

  cerrarModal(): void {
    this.isOpen.set(false);
    this.paisForm.reset();
  }

  submitForm(): void {

    if (this.paisForm.invalid) {
      this.paisForm.markAllAsTouched();
      return;
    }

    const pais: PaisCrear = {
      Nombre: this.paisForm.get('nombre')?.value,
      CodigoPais: this.paisForm.get('codigo')?.value
    };

    this.paisesService.postPais(pais).subscribe({

      next: (response) => {

        console.log('✅ País creado correctamente:', response);

        this.cerrarModal();

        this.paisCreado.emit();

      },

      error: (error) => {

        console.error('❌ Error al crear país:', error);

      }

    });
  }

}