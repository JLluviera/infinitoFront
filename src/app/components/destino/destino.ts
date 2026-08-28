import { Component, inject } from '@angular/core';
import { Destino,CrearDestino } from '../../models/destino.model';
import { DestinoService } from '../../services/destinos.service/destino.service';
import { CommonModule } from '@angular/common';
import { DestinoFormulario } from './destino-formulario/destino-formulario';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-destino',
  imports: [CommonModule,DestinoFormulario],
  templateUrl: './destino.html',
  styleUrl: './destino.css',
})
export class DestinoComponent  {

  private destinoService = inject(DestinoService);
  private cdr = inject(ChangeDetectorRef);

  destinos: Destino[] = [];
  mostrarFormulario:boolean = false;
  destinoEditando: Destino | null = null;

  obtenerDestinos(): void {
    this.destinoService.obtenerDestinos().subscribe({
      
      next: (destinos) => {
        this.destinos = destinos;
        this.cdr.detectChanges();
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
  editarDestino(destino: Destino): void {
    this.destinoEditando = destino;
    this.mostrarFormulario = true;
  }

  guardarDestino(datos: CrearDestino): void {
  if (this.destinoEditando) {
    // Modo edición
    this.destinoService.editarDestino(this.destinoEditando.id, datos).subscribe({
      next: () => this.finalizarFormulario(),
      error: (err) => console.error(err)
    });
  } else {
    // Modo creación
    
    this.destinoService.crearDestino(datos).subscribe({
      next: () => this.finalizarFormulario(),
      error: (err) => console.error(err)
    });
  }
}

  private finalizarFormulario(): void {
    this.mostrarFormulario = false;
    this.destinoEditando = null;
    this.obtenerDestinos();
  }
}