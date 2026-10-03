import { Component, input, signal } from '@angular/core';
import { ModalGenericoComponent } from '../../../modal-generico/modal-generico';
import { CrearReservaComponent } from '../../crear-reserva.component/crear-reserva.component';

@Component({
  selector: 'app-modal-crear-reserva',
  imports: [ModalGenericoComponent, CrearReservaComponent],
  templateUrl: './modal-crear-reserva.component.html',
  styleUrl: './modal-crear-reserva.component.css',
})
export class ModalCrearReservaComponent {
  idExcursion = input<number>(0);

  isOpen = signal<boolean>(false);


  abrirModal(): void{
    this.isOpen.set(true);
  }

  cerrarModal(): void{
    this.isOpen.set(false);
  }
}
