import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaisCrear } from '../../../models/paisCrear.model';
import { PaisesService } from '../../../services/paises.service/paises.service';
import { Observable } from 'rxjs';

import { Pais } from '../../../models/pais.model';

@Component({
  selector: 'app-boton-agregar-pais',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pais.boton-agregar.component.html'
})
export class paisBotonAgregarComponent {
  private paisesService = inject(PaisesService);
  // Manejo del estado del modal con Signals (Angular v16+)
  isOpen = signal<boolean>(false);
  
  paisForm: FormGroup;

  // Emite los datos al componente padre. La lógica de la API la manejas allí.
  onGuardar(): any {
    const pais: PaisCrear = {
      Nombre: this.paisForm.get('nombre')?.value,
      CodigoPais: this.paisForm.get('codigo')?.value
    };
    return this.paisesService.postPais(pais);
  };

  constructor(private fb: FormBuilder) {
    this.paisForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      codigo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(5)]]
    });
  }

  abrirModal() {
    this.isOpen.set(true);
  }

  cerrarModal() {
    this.isOpen.set(false);
    this.paisForm.reset();
  }

  submitForm() {
    if (this.paisForm.valid) {
      var result = this.onGuardar;
      if(result instanceof Observable) {
        console.log('Creado correctamente');
      this.cerrarModal();
    } else {
      // Marca todos los campos como tocados para mostrar errores si los hay
      this.paisForm.markAllAsTouched();
    }
  }
}}