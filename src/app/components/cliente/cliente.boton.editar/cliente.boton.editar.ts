import {Component,EventEmitter,Input,Output,inject,OnChanges,SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder,FormGroup,ReactiveFormsModule,Validators} from '@angular/forms';
import {Cliente,CrearCliente} from '../../../models/cliente.model';
import { ClientesService } from '../../../services/clientes.service/clientes.service';
import { ModalGenericoComponent }from '../../modal-generico/modal-generico';


@Component({
  selector: 'app-cliente-boton-editar',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalGenericoComponent
  ],

  templateUrl: './cliente.boton.editar.html',
  styleUrl: './cliente.boton.editar.css'
})
export class ClienteBotonEditarComponent implements OnChanges {

  private clientesService = inject(ClientesService);
  private fb = inject(FormBuilder);


  @Input() cliente: Cliente | null = null;

  @Output() clienteEditado = new EventEmitter<void>();

  @Output() cerrar = new EventEmitter<void>();


  mostrarModal = false;


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


  ngOnChanges(changes: SimpleChanges): void {

    if (changes['cliente'] && this.cliente) {

      this.clienteForm.patchValue({

        nombre: this.cliente.nombre,

        apellido: this.cliente.apellido,

        ci: this.cliente.ci,

        telefono: this.cliente.telefono,

        fechaNacimiento: this.cliente.fechaNacimiento

      });

      this.mostrarModal = true;
    }

  }


  cerrarModal(): void {

    this.mostrarModal = false;

    this.clienteForm.reset();

    this.cerrar.emit();

  }


  submitForm(): void {

    if (!this.cliente) {
      return;
    }

    if (this.clienteForm.invalid) {

      this.clienteForm.markAllAsTouched();

      return;

    }


    const clienteModificado: CrearCliente = {

      nombre: this.clienteForm.get('nombre')?.value,

      apellido: this.clienteForm.get('apellido')?.value,

      ci: this.clienteForm.get('ci')?.value,

      telefono: this.clienteForm.get('telefono')?.value,

      fechaNacimiento: this.clienteForm.get('fechaNacimiento')?.value

    };


    console.log(
      '📦 CLIENTE A EDITAR:',
      clienteModificado
    );

    console.log(
      '🆔 ID:',
      this.cliente.id
    );


    this.clientesService
      .editarCliente(
        this.cliente.id,
        clienteModificado
      )
      .subscribe({

        next: (respuesta) => {

          console.log(
            '✅ CLIENTE ACTUALIZADO:',
            respuesta
          );

          this.mostrarModal = false;

          this.clienteEditado.emit();

        },

        error: (error) => {

          console.error(
            '❌ ERROR AL EDITAR CLIENTE:',
            error
          );

        }

      });

  }

}