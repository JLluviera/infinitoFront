import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-generico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-generico.html',
  styleUrl: './modal-generico.css'
})
export class ModalGenericoComponent {

  @Input() titulo: string = '';
  @Input() subtitulo: string = '';

  @Output() cerrar = new EventEmitter<void>();

  cerrarModal(): void {
    this.cerrar.emit();
  }

}