import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select-generico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-generico.html',
})
export class SelectGenericoComponent<T extends Record<string, any>> {

  @Output() seleccionCambiada = new EventEmitter<number>();
  @Input() items: T[] = [];
  @Input() valor = 'id';
  @Input() texto = 'nombre';
  @Input() disabled = false;

  onSeleccion(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const valorNumerico = Number(selectElement.value);
    this.seleccionCambiada.emit(valorNumerico); // emitimos el cambio al padre.
  }
}