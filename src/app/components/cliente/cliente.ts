import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cliente } from '../../models/cliente.model';
import { ClientesService } from '../../services/clientes.service/clientes.service';
import { ClienteBotonAgregarComponent } from './cliente.boton.agregar/cliente.boton.agregar';
import { ColumnaTabla, ListaGenericaComponent, } from '../lista-generica.component/lista-generica.component';
import { ModalGenericoComponent } from '../modal-generico/modal-generico';
import { ClienteBotonEditarComponent } from './cliente.boton.editar/cliente.boton.editar';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule, ListaGenericaComponent, ModalGenericoComponent, ClienteBotonAgregarComponent,ClienteBotonEditarComponent],
  templateUrl: './cliente.html',
  styleUrl: './cliente.css'
})
export class ClienteComponent {
  mostrarModal: boolean = false;
  clientes = signal<Cliente[]>([]);
  clienteSeleccionado: Cliente | null = null; mostrarEdicion = false;
  columnas: ColumnaTabla<Cliente>[] = [
    { header: 'ID', field: 'id', tipo: 'id' },
    { header: 'Nombre', field: 'nombre', tipo: 'texto' },
    { header: 'Apellido', field: 'apellido', tipo: 'texto' },
    { header: 'CI', field: 'ci', tipo: 'texto' },
    { header: 'Teléfono', field: 'telefono', tipo: 'texto' },
    { header: 'Fecha de nacimiento', field: 'fechaNacimiento', tipo: 'texto' }
  ];

  constructor(private clienteService: ClientesService) {
    this.obtenerClientes();
  }

  obtenerClientes(): void {
    this.clienteService.obtenerClientes().subscribe({
      next: (clientes) => {
        console.log('✅ CLIENTES RECIBIDOS:', clientes);

        this.clientes.set(clientes);
      },

      error: (error) => {
        console.error('❌ Error al obtener clientes:', error);
      }
    });
  }

  recargarClientes(): void {
    this.obtenerClientes();
  }
  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  editarCliente(cliente: Cliente): void {

  this.clienteSeleccionado = cliente;
  this.mostrarEdicion = true;

}
cerrarEdicion(): void {

  this.mostrarEdicion = false;
  this.clienteSeleccionado = null;

}
finalizarEdicion(): void {

  this.mostrarEdicion = false;
  this.clienteSeleccionado = null;

  this.obtenerClientes();

}
eliminarCliente(id: number): void {

  const confirmado = confirm(
    '¿Está seguro que desea eliminar este cliente?'
  );

  if (!confirmado) {
    return;
  }

  this.clienteService.borrarCliente(id).subscribe({

    next: () => {

      console.log('✅ Cliente eliminado correctamente');

      this.obtenerClientes();

    },

    error: (error) => {

      console.error(
        '❌ Error al eliminar cliente:',
        error
      );

    }

  });

}
}