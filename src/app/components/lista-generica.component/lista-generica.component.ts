import { Component, input, output } from '@angular/core';

export type TipoColumna = 'texto' | 'id' | 'img' | 'chip';

export interface ColumnaTabla<T> {
  header: string;
  field: keyof T;
  tipo?: TipoColumna;
}

@Component({
  selector: 'app-lista-generica',
  imports: [],
  templateUrl: './lista-generica.component.html',
  styleUrl: './lista-generica.component.css',
})

export class ListaGenericaComponent<T> {

  data = input.required<T[]>();
  columnas = input.required<ColumnaTabla<T>[]>();

  titulo = input<string>();
  subtitulo = input<string>();

  onEdit =  output<T>();
  onDelete = output<T>();
}
