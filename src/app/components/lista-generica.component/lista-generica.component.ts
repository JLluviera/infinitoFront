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

export class ListaGenericaComponent<T> {//

  data = input.required<T[]>();
  columnas = input.required<ColumnaTabla<T>[]>();

  rutaDetalle = input<string>();
  campoId = input<string>('id');

  titulo = input<string>();
  subtitulo = input<string>();

  onEdit = output<T>();
  onDelete = output<T>();
  onDetail = output<T>();

  mostrarEliminar = input<boolean>(true);
  mostrarEditar = input<boolean>(true);
  mostrarDetalle = input<boolean>(false);

  hasMore = input(false);
  loadingMore = input(false);
  loadMore = output<void>();

  
  

  onScroll(event: Event): void {

    const elemento = event.target as HTMLElement;

    const llegoAlFinal =
      elemento.scrollTop + elemento.clientHeight >=
      elemento.scrollHeight - 50;

    if (
      llegoAlFinal &&
      this.hasMore() &&
      !this.loadingMore()
    ) {
      this.loadMore.emit();
    }
  }
}