import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaisCrear } from '../../../models/paisCrear.model';
import { PaisesService } from '../../../services/paises.service/paises.service';

@Component({
  selector: 'app-boton-agregar-pais',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pais.boton-agregar.component.html'
})
export class PaisBotonAgregarComponent {
  private paisesService = inject(PaisesService);
  private fb = inject(FormBuilder);

  // Opcional: Si quieres notificar al padre para que recargue la lista de países tras guardar
  @Output() paisCreado = new EventEmitter<void>();

  isOpen = signal<boolean>(false);

  paisForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    codigo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(5)]]
  });

  abrirModal() {
    this.isOpen.set(true);
  }

  cerrarModal() {
    this.isOpen.set(false);
    this.paisForm.reset();
  }

  submitForm() {
    if (this.paisForm.invalid) {
      // Si el formulario no es válido, marca los campos para mostrar los errores visuales
      this.paisForm.markAllAsTouched();
      return;
    }

    const pais: PaisCrear = {
      Nombre: this.paisForm.get('nombre')?.value,
      CodigoPais: this.paisForm.get('codigo')?.value
    };

    // Nos suscribimos al servicio para gatillar la petición POST
    this.paisesService.postPais(pais).subscribe({
      next: (response) => {
        console.log('Creado correctamente', response);
        this.cerrarModal();
        this.paisCreado.emit(); // Notifica al componente padre
      },
      error: (error) => {
        console.error('Error al crear el país:', error);
      }
    });
  }
}