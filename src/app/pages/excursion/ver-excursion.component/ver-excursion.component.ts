import { Component, input, signal, effect, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Excursion } from '../../../models/excursion.model';
import { ExcursionService } from '../../../services/excursiones.service/excursion.service';

@Component({
  selector: 'app-ver-excursion',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './ver-excursion.component.html'
})
export class VerExcursionComponent {
  // Recibe el 'id' automáticamente desde la ruta
  idExcursion = input.required<string>({ alias: 'id' });

  private router = inject(Router);
  excursionService = inject(ExcursionService);
  excursion = signal<Excursion | null>(null);
  cargando = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const id = this.idExcursion();
      if (id) {
        this.obtenerDetalleExcursion(id);
      }
      else {
        this.error.set('ID de excursión no proporcionado');
        this.cargando.set(false);
        this.router.navigate(['/excursiones']);
      }
    });
  }

  private obtenerDetalleExcursion(id: string): void {
    this.cargando.set(true);
    this.error.set(null);

    this.excursionService.obtenerExcursionPorId(Number(id)).subscribe({
      next: (excursion) => {
        this.excursion.set(excursion);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set('Error al obtener el detalle de la excursión');
        this.cargando.set(false);
      }
    })    
    
  }
}