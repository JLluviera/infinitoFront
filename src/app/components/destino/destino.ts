import { Component, OnInit, inject } from '@angular/core';
import { Destino } from '../../models/destino.model';
import { DestinoService } from '../../services/destinos.service/destino.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-destino',
  imports: [CommonModule],
  templateUrl: './destino.html',
  styleUrl: './destino.css',
})
export class DestinoComponent  {

  private destinoService = inject(DestinoService);

  destinos: Destino[] = [];

  obtenerDestinos(): void {
    this.destinoService.obtenerDestinos().subscribe({
      
      next: (destinos) => {
        this.destinos = destinos;
      },
      error: (error) => {
        console.error('Error al obtener destinos:', error);
      }
    });
  }

  eliminarDestino(id: number): void {
  this.destinoService.eliminarDestino(id).subscribe({
    next: () => {
      console.log('Destino eliminado correctamente');

      // Volvemos a cargar la lista
      this.obtenerDestinos();
    },
    error: (error) => {
      console.error('Error al eliminar destino:', error);
    }
  });
}
}