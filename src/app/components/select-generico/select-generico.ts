import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select-generico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-generico.html',
})
export class SelectGenericoComponent<T extends Record<string, any>> {

  @Input() items: T[] = [];
  @Input() valor = 'id';
  @Input() texto = 'nombre';

}