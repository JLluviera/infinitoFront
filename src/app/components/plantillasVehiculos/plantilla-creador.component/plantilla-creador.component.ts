import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlantillaVehiculoService } from '../../../services/plantillaVehiculo.service/plantilla-vehiculo.service';
import { CrearAsientoDto } from '../../../models/crearAsientoDto';
import { CrearPlantillaVehiculoDto } from '../../../models/crearPlantillaVehiculoDto';
import { TipoAsiento } from '../../../models/asiento.model';

@Component({
  selector: 'app-plantilla-creador',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './plantilla-creador.component.html'
})
export class PlantillaCreadorComponent {
  private plantillasService = inject(PlantillaVehiculoService);

  // Enum expuesto para usar en el template
  TipoAsiento = TipoAsiento;

  // Estado del Formulario
  nombrePlantilla = signal<string>('Ómnibus Semicama 44 Asientos');
  totalPisos = signal<number>(1);
  pisoActivo = signal<number>(1);
  filas = signal<number>(11);
  columnas = signal<number>(5);

  // Herramienta seleccionada para "pintar" celdas
  tipoSeleccionado = signal<TipoAsiento>(TipoAsiento.Standard);

  // Matriz completa de asientos en memoria
  asientosGrid = signal<CrearAsientoDto[]>([]);

  // Estados de UI
  guardando = signal<boolean>(false);
  mensajeExito = signal<string | null>(null);
  mensajeError = signal<string | null>(null);

  constructor() {
    this.generarGrilla();
  }

  // Genera la grilla inicial basada en filas, columnas y pisos
  generarGrilla() {
    const nuevosAsientos: CrearAsientoDto[] = [];
    let contadorAsiento = 1;

    for (let piso = 1; piso <= this.totalPisos(); piso++) {
      for (let fila = 1; fila <= this.filas(); fila++) {
        for (let col = 1; col <= this.columnas(); col++) {
          // Por defecto deja la columna central (columna 3 en grilla de 5) como Pasillo
          const esPasilloCentral = this.columnas() >= 5 && col === 3;
          const tipoInicial = esPasilloCentral ? TipoAsiento.Cama : TipoAsiento.Standard;

          nuevosAsientos.push({
            pisoAsiento: piso,
            fila: fila,
            columna: col,
            tipoAsiento: tipoInicial,
            numeroAsiento: tipoInicial === TipoAsiento.Standard ? (contadorAsiento++).toString() : ''
          });
        }
      }
    }
    this.asientosGrid.set(nuevosAsientos);
  }

  // Filtra los asientos correspondientes al piso actualmente visible
  asientosPisoActivo = computed(() =>
    this.asientosGrid().filter(a => a.pisoAsiento === this.pisoActivo())
  );

  // Permite hacer clic en una celda para cambiar su tipo con la herramienta seleccionada
  aplicarTipo(asiento: CrearAsientoDto) {
    this.asientosGrid.update(asientos =>
      asientos.map(a => {
        if (a.pisoAsiento === asiento.pisoAsiento && a.fila === asiento.fila && a.columna === asiento.columna) {
          return { ...a, tipoAsiento: this.tipoSeleccionado() };
        }
        return a;
      })
    );
    this.recalcularNumeracion();
  }

  // Enumera secuencialmente los asientos que son de tipo Standard o Cama
  recalcularNumeracion() {
    let contador = 1;
    this.asientosGrid.update(asientos =>
      asientos.map(a => {
        if (a.tipoAsiento === TipoAsiento.Standard || a.tipoAsiento === TipoAsiento.Cama) {
          return { ...a, numeroAsiento: (contador++).toString() };
        }
        return { ...a, numeroAsiento: '' };
      })
    );
  }

  guardarPlantilla() {
    if (!this.nombrePlantilla().trim()) {
      this.mensajeError.set('Debes ingresar un nombre para la plantilla.');
      return;
    }

    this.guardando.set(true);
    this.mensajeError.set(null);
    this.mensajeExito.set(null);

    const payload: CrearPlantillaVehiculoDto = {
      nombrePlantilla: this.nombrePlantilla(),
      totalPisos: this.totalPisos(),
      totalFilas: this.filas(),
      totalColumnas: this.columnas(),
      asientos: this.asientosGrid()
    };

    this.plantillasService.crearPlantilla(payload).subscribe({
      next: (res: any) => {
        this.guardando.set(false);
        this.mensajeExito.set(`${res}`);
      },
      error: (err) => {
        this.guardando.set(false);
        this.mensajeError.set(err.error || 'Error al guardar la plantilla.');
      }
    });
  }
}