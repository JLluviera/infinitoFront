import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
export class ExcursionComponent implements OnInit {

  private destinoService = inject(DestinoService);
  private excursionService = inject(ExcursionService);

  excursiones = signal<Excursion[]>([]);
  excursionSeleccionada: Excursion | null = null;
  mostrarEdicion = false;

  cursor = signal<number | null>(null);
  hayMas = signal(true);
  cargando = signal(false);

  // Mapa para almacenar los destinos en memoria (Id -> Nombre)
  private destinosMap = new Map<number, string>();

  columnas: ColumnaTabla<Excursion>[] = [
    { header: 'ID', field: 'id', tipo: 'id' },
    { header: 'Nombre', field: 'nombre', tipo: 'link' },
    { header: 'Fecha Salida', field: 'fechaSalida', tipo: 'texto' },
    { header: 'Cantidad Días', field: 'cantDias', tipo: 'texto' },
    { header: 'Cantidad Lugares', field: 'cantLugares', tipo: 'texto' },
    { header: 'ID Destino', field: 'destinoId', tipo: 'id' },
  ];

  ngOnInit(): void {
    this.inicializarDatos();
  }

  /**
   * Carga la lista de destinos UNA sola vez y luego inicia la paginación.
   */
  inicializarDatos(): void {
    this.cargando.set(true);
    this.destinoService.obtenerDestinos().subscribe({
      next: destinos => {
        // Guardamos los destinos en un mapa para acceso rápido
        this.destinosMap.clear();
        destinos.forEach(d => this.destinosMap.set(d.id, d.nombre));
        
        this.cargando.set(false);
        this.cargarExcursionesInicial();
      },
      error: err => {
        console.error('Error al obtener destinos:', err);
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

  cargarExcursiones(): void {
    // Si ya está cargando o sabemos que no hay más datos, salimos de inmediato
    if (this.cargando() || !this.hayMas()) {
      return;
    }

    this.cargando.set(true);

    this.excursionService.obtenerExcursionesPaginado(this.cursor()).subscribe({
      next: pagina => {
        const excursionesConDestino = pagina.elementos.map(excursion => ({
          ...excursion,
          nombreDestino: this.destinosMap.get(excursion.destinoId) ?? 'Sin destino'
        }));

        this.excursiones.update(actuales => [
          ...actuales,
          ...excursionesConDestino
        ]);

        // Si la página indica que no hay más elementos o no devolvió cursor, cortamos la paginación
        if (!pagina.hayMas || pagina.siguienteCursor === null) {
          this.hayMas.set(false);
          this.cursor.set(null);
        } else {
          this.cursor.set(pagina.siguienteCursor);
          this.hayMas.set(true);
        }

        this.cargando.set(false);
      },
      error: error => {
        console.error('Error al obtener excursiones:', error);
        this.cargando.set(false);
      }
    });
  }

  recargarExcursiones(): void {
    this.cargarExcursionesInicial();
  }

  eliminarExcursion(id: number, nombre: string): void {
    const confirmado = confirm(`¿Está seguro que quiere eliminar la excursión "${nombre}"?`);
    if (!confirmado) return;

    this.excursionService.borrarExcursion(id).subscribe({
      next: () => {
        console.log('✅ Excursión eliminada correctamente');
        this.recargarExcursiones();
      },
      error: error => console.error('❌ Error al eliminar excursión:', error)
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
    this.recargarExcursiones();
  }
}