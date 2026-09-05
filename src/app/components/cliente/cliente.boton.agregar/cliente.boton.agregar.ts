import {Component,EventEmitter,Output,inject,signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder,FormGroup,ReactiveFormsModule,Validators} from '@angular/forms';
import { CrearCliente } from '../../../models/cliente.model';
import { ClientesService } from '../../../services/clientes.service/clientes.service';
import { ModalGenericoComponent } from '../../modal-generico/modal-generico';

@Component({
  selector: 'app-cliente-boton-agregar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalGenericoComponent
  ],
  templateUrl: './cliente.boton.agregar.html',
  styleUrl: './cliente.boton.agregar.css'
})
export class ClienteBotonAgregarComponent {

  private clientesService = inject(ClientesService);
  private fb = inject(FormBuilder);

  @Output() clienteCreado = new EventEmitter<void>();

  isOpen = signal<boolean>(false);

  clienteForm: FormGroup = this.fb.group({

    nombre: [
      '',
      [
        Validators.required,
        Validators.minLength(2)
      ]
    ],

    apellido: [
      '',
      [
        Validators.required,
        Validators.minLength(2)
      ]
    ],

    ci: [
      '',
      [
        Validators.required,
        Validators.min(1)
      ]
    ],

    telefono: [
      '',
      Validators.required
    ],

    fechaNacimiento: [
      '',
      Validators.required
    ]

  });


  abrirModal(): void {
    this.isOpen.set(true);
  }


  cerrarModal(): void {

    this.isOpen.set(false);

    this.clienteForm.reset();

  }


  submitForm(): void {

    if (this.clienteForm.invalid) {

      this.clienteForm.markAllAsTouched();

      return;
    }


    const cliente: CrearCliente = {

      nombre: this.clienteForm.get('nombre')?.value,

      apellido: this.clienteForm.get('apellido')?.value,

      ci: this.clienteForm.get('ci')?.value,

      telefono: this.clienteForm.get('telefono')?.value,

      fechaNacimiento: this.clienteForm.get('fechaNacimiento')?.value

    };


    console.log('📦 CLIENTE A CREAR:', cliente);


    this.clientesService.crearCliente(cliente).subscribe({

      next: (respuesta) => {

        console.log('✅ CLIENTE CREADO CORRECTAMENTE:', respuesta);

        this.cerrarModal();

        this.clienteCreado.emit();

      },

      error: (error) => {

        console.error('❌ ERROR AL CREAR CLIENTE:', error);

      }

    });

  }

}