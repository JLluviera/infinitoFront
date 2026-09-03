import { Component, input, signal, effect } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Excursion } from '../../../models/excursion.model';

@Component({
  selector: 'app-ver-excursion',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './ver-excursion.component.html'
})
export class VerExcursionComponent {
  // Recibe el 'id' automáticamente desde la ruta
  idExcursion = input.required<string>({ alias: 'id' });

  excursion = signal<Excursion | null>(null);
  cargando = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const id = this.idExcursion();
      if (id) {
        this.obtenerDetalleExcursion(id);
      }
    });
  }

  private obtenerDetalleExcursion(id: string): void {
    this.cargando.set(true);
    this.error.set(null);

    // Mock temporal para probar el componente (Sustituir por tu servicio API)
    setTimeout(() => {
      this.excursion.set({
        id: 100,
        nombre: 'Travesía por los Lagos y Montañas',
        cantDias: 5,
        cantLugares: 18,
        fechaSalida: '2026-11-20',
        destinoId: 402,
        destino: {
          id: 402,
          nombre: 'Bariloche',
          idPais: 1,
          ciudad: 'San Carlos de Bariloche',
          descripcion: 'Bariloche es una ciudad ubicada en la región de la Patagonia, Argentina. Es famosa por sus paisajes montañosos, lagos cristalinos y su arquitectura de estilo alpino. La ciudad es un destino turístico popular para actividades al aire libre como el senderismo, el esquí y la pesca.'
        },
      });
      this.cargando.set(false);
    }, 400);
  }
}