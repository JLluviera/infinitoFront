import { Component, input, OnInit, output, signal } from '@angular/core';
import { ModalGenericoComponent } from '../../../modal-generico/modal-generico';
import { GestionarClientesIncluidos } from '../../clientesIncluidos/gestionar-clientes-incluidos.component/gestionar-clientes-incluidos.component';
import { Cliente } from '../../../../models/cliente.model';

@Component({
  selector: 'app-boton-clientes-incluidos',
  imports: [ModalGenericoComponent, GestionarClientesIncluidos],
  templateUrl: './boton-clientes-incluidos.component.html',
  styleUrl: './boton-clientes-incluidos.component.css',
})
export class BotonClientesIncluidosComponent {
  clientesIncluidosRecibidos = input.required<Cliente[]>();
  idReservaRecibido = input.required<number>();

  readonly clientesModificados = output<void>();

  isOpen = signal<boolean>(false);
  
  abrirModal() : void {
    this.isOpen.set(true);
  }

  cerrarModal() : void {
    this.isOpen.set(false);
    this.clientesModificados.emit();
  }

}
