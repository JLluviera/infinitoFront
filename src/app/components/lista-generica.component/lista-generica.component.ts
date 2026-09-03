import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export type TipoColumna = 'texto' | 'id' | 'img' | 'chip' | 'link';

export interface ColumnaTabla<T> {
  header: string;
  field: keyof T;
  tipo?: TipoColumna;
}

@Component({
  selector: 'app-lista-generica',
  imports: [CommonModule, RouterLink],
  templateUrl: './lista-generica.component.html',
  styleUrl: './lista-generica.component.css',
})

export class ListaGenericaComponent<T> {

  data = input.required<T[]>();
  columnas = input.required<ColumnaTabla<T>[]>();

  rutaDetalle = input<string>();
  campoId = input<string>('id');

  titulo = input<string>();
  subtitulo = input<string>();

  onEdit =  output<T>();
  onDelete = output<T>();
}
