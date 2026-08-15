import { Component, OnInit, inject } from '@angular/core';
import { Destino,CrearDestino } from '../../models/destino.model';
import { DestinoService } from '../../services/destinos.service/destino.service';
import { CommonModule } from '@angular/common';
import { DestinoFormulario } from './destino-formulario/destino-formulario';

@Component({
  selector: 'app-destino',
  imports: [CommonModule,DestinoFormulario],
  templateUrl: './destino.html',
  styleUrl: './destino.css',
})
export class DestinoComponent  {

  private destinoService = inject(DestinoService);

  destinos: Destino[] = [];
  mostrarFormulario = false;

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
crearDestino(destino: CrearDestino): void {
    this.destinoService.crearDestino(destino).subscribe({
      next: (destinoCreado) => {
        console.log('Destino creado correctamente:', destinoCreado);
        this.mostrarFormulario = false;
        this.obtenerDestinos();
      },
      error: (error) => {
        console.error('Error al crear destino:', error);
      }
    });
  }
}