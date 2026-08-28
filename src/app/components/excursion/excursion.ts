import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { Excursion } from '../../models/excursion.model';
import { ExcursionService } from '../../services/excursiones.service/excursion.service';

import { ExcursionBotonAgregarComponent } from './excursion.boton.agregar.component/excursion.boton.agregar.component';

@Component({
  selector: 'app-excursion',
  standalone: true,
  imports: [
    CommonModule,
    ExcursionBotonAgregarComponent
  ],
  templateUrl: './excursion.html',
  styleUrl: './excursion.css'
})
export class ExcursionComponent {

  excursiones$: Observable<Excursion[]>;

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
}
