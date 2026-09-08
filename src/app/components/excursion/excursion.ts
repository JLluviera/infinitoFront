import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Excursion } from '../../models/excursion.model';
import { ExcursionService } from '../../services/excursiones.service/excursion.service';
import { ExcursionBotonEditarComponent } from './excursion.boton.editar/excursion.boton.editar';
import { ExcursionBotonAgregarComponent } from './excursion.boton.agregar.component/excursion.boton.agregar.component';
import { ColumnaTabla, ListaGenericaComponent } from '../../components/lista-generica.component/lista-generica.component';

@Component({
  selector: 'app-excursion',
  standalone: true,
  imports: [CommonModule, ExcursionBotonEditarComponent, ExcursionBotonAgregarComponent, ListaGenericaComponent],
  templateUrl: './excursion.html',
  styleUrl: './excursion.css'
})
export class ExcursionComponent {

  excursiones = signal<Excursion[]>([]);
  excursionSeleccionada: Excursion | null = null;
  mostrarEdicion = false;
  constructor(private excursionService: ExcursionService) {
    
    this.excursionService.obtenerExcursiones().subscribe({
      next: (excursiones) => {
        this.excursiones.set(excursiones);
      },
      error: (error) => {
        console.error('Error al obtener excursiones:', error);
      }
    });

  }

  columnas: ColumnaTabla<Excursion>[] = [
    { header: 'ID', field: 'id', tipo: 'id' },
    { header: 'Nombre', field: 'nombre', tipo: 'link' },
    { header: 'Fecha Salida', field: 'fechaSalida', tipo: 'texto' },
    { header: 'Cantidad Días', field: 'cantDias', tipo: 'texto' },
    { header: 'Cantidad Lugares', field: 'cantLugares', tipo: 'texto' },
    { header: 'ID Destino', field: 'destinoId', tipo: 'id' },
  ]

  recargarExcursiones(): void {
    this.excursionService.obtenerExcursiones().subscribe({
       next:(excursiones) =>{
          this.excursiones.set(excursiones);
       },
        error:(error) =>{
          console.error('Error al obtener excursiones:', error);
        }
    });
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
    this.recargarExcursiones();
  }
  finalizarEdicion(): void {
    this.mostrarEdicion = false;
    this.excursionSeleccionada = null;
    this.mostrarEdicion = false;
    this.recargarExcursiones();
  }
}