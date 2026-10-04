import { Component, signal,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Excursion } from '../../models/excursion.model';
import { ExcursionService } from '../../services/excursiones.service/excursion.service';
import { ExcursionBotonEditarComponent } from './excursion.boton.editar/excursion.boton.editar';
import { ExcursionBotonAgregarComponent } from './excursion.boton.agregar.component/excursion.boton.agregar.component';
import { ColumnaTabla, ListaGenericaComponent } from '../../components/lista-generica.component/lista-generica.component';
import { DestinoService } from '../../services/destinos.service/destino.service';
@Component({
  selector: 'app-excursion',
  standalone: true,
  imports: [CommonModule, ExcursionBotonEditarComponent, ExcursionBotonAgregarComponent, ListaGenericaComponent],
  templateUrl: './excursion.html',
  styleUrl: './excursion.css'
})
export class ExcursionComponent {

  private destinoService=inject(DestinoService);
  excursiones = signal<Excursion[]>([]);
  excursionSeleccionada: Excursion | null = null;
  mostrarEdicion = false;


  cursor = signal<number | null>(null);
  hayMas = signal(true);
  cargando = signal(false);

  constructor(private excursionService: ExcursionService) {
  this.cargarExcursionesInicial();
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
  this.cargarExcursionesInicial();
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
  cargarExcursiones(): void {

  if (this.cargando() || !this.hayMas()) {
    return;
  }

  this.cargando.set(true);

  this.destinoService.obtenerDestinos().subscribe({
    next: destinos => {

      this.excursionService
        .obtenerExcursionesPaginado(this.cursor())
        .subscribe({
          next: pagina => {

            const excursionesConDestino = pagina.elementos.map(excursion => ({
              ...excursion,
              nombreDestino: destinos.find(
                destino => destino.id === excursion.destinoId
              )?.nombre ?? 'Sin destino'
            }));

            this.excursiones.update(excursionesActuales => [
              ...excursionesActuales,
              ...excursionesConDestino
            ]);

            this.cursor.set(pagina.siguienteCursor);
            this.hayMas.set(pagina.hayMas);
            this.cargando.set(false);
          },

          error: error => {
            console.error('Error al obtener excursiones:', error);
            this.cargando.set(false);
          }
        });
    },

    error: error => {
      console.error('Error al obtener destinos:', error);
      this.cargando.set(false);
    }
  });
}
cargarExcursionesInicial(): void {
  this.excursiones.set([]);
  this.cursor.set(null);
  this.hayMas.set(true);
  this.cargarExcursiones();
}
}