import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Excursion } from '../../models/excursion.model';
import { ExcursionService } from '../../services/excursiones.service/excursion.service';
import { ExcursionBotonEditarComponent } from './excursion.boton.editar/excursion.boton.editar';

@Component({
  selector: 'app-excursion',
  standalone: true,
  imports: [CommonModule, ExcursionBotonEditarComponent],
  templateUrl: './excursion.html',
  styleUrl: './excursion.css'
})
export class ExcursionComponent {

  excursiones$: Observable<Excursion[]>;
  excursionSeleccionada: Excursion | null = null;
  mostrarEdicion = false;
  constructor(private excursionService: ExcursionService) {
    this.excursiones$ = this.excursionService.obtenerExcursiones();
  }

  recargarExcursiones(): void {
    this.excursiones$ = this.excursionService.obtenerExcursiones();
  }

  eliminarExcursion(id: number, nombre: string): void {

    const confirmado = confirm(
      `¿Está seguro que quiere eliminar la excursión "${nombre}"?`
    );

    if (!confirmado) {
      return;
    }

    this.excursionService.borrarExcursion(id).subscribe({

      next: () => {
        console.log('✅ Excursión eliminada correctamente');
        this.recargarExcursiones();
      },

      error: (error) => {
        console.error('❌ Error al eliminar excursión:', error);
      }

    });
  }
  editarExcursion(excursion: Excursion): void {
    this.excursionSeleccionada = excursion;
    this.mostrarEdicion = true;
  }

  cerrarEdicion(): void {
    this.mostrarEdicion = false;
    this.excursionSeleccionada = null;
  }
  finalizarEdicion(): void {
    this.recargarExcursiones();
    this.mostrarEdicion = false;
    this.excursionSeleccionada = null;
  }
}