import { Component, Input, OnInit, signal, computed, input, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { AsientoMapaDTO } from '../../../models/DTOs/AsientoMapaDTO';
import { PasajeroPendienteDTO } from '../../../models/DTOs/pasajeroPendienteDTO';
import { AsignarAsientoRequestDTO } from '../../../models/DTOs/asignarAsientoRequestDTO';
import { TipoAsiento } from '../../../models/asiento.model';
import { Router } from '@angular/router';
import { MapaExcursionResponseDTO } from '../../../models/DTOs/mapaExcursionResponseDTO';
import { AsientoService } from '../../../services/asignacionAsientos.service/asignaciones-asientos.service';
import { AlertService } from '../../../services/alert.service/alert-service';

@Component({
  selector: 'app-asignacion-asientos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './asignacion-asientos.component.html'
})
export class AsignacionAsientosComponent implements OnInit {
  private alertas = inject(AlertService);
  private router = inject(Router);
  private location = inject(Location);
  private asignacionesAsientosService = inject(AsientoService);

  excursionId = input.required<number>();

  idExcursion = signal<number>(0);

  mapaExcursion = signal<MapaExcursionResponseDTO | null>(null);

  mapaAsientos = signal<AsientoMapaDTO[]>([]);
  pasajerosPendientes = signal<PasajeroPendienteDTO[]>([]);
  
  pasajeroSeleccionado = signal<PasajeroPendienteDTO | null>(null);
  pisoActivo = signal<number>(1);
  guardando = signal<boolean>(false);
  cargando = signal<boolean>(false);

  enumTipoAsiento = TipoAsiento;

  // Lista de Pisos disponibles en esta plantilla
  pisosDisponibles = computed(() => {
    const pisos = this.mapaAsientos().map(a => a.pisoAsiento);
    return Array.from(new Set(pisos)).sort((a, b) => a - b);
  });

  // Filtramos la matriz según el piso activo actual
  asientosPisoActual = computed(() => {
    return this.mapaAsientos().filter(a => a.pisoAsiento === this.pisoActivo());
  });

  // Matriz bidimensional computada (Fila x Columna) para el piso actual
  matrizPiso = computed(() => {
    const asientos = this.asientosPisoActual();
    if (asientos.length === 0) return [];

    const maxFila = this.mapaExcursion()?.totalFilas ||  1;
    const maxCol = this.mapaExcursion()?.totalColumnas || 1;

    // Inicializar matriz vacía
    const grid: (AsientoMapaDTO | null)[][] = Array.from({ length: maxFila }, () =>
      Array(maxCol).fill(null)
    );

    // Ubicar cada asiento en su coordenada (fila - 1, columna - 1)
    asientos.forEach(a => {
    if (a.fila > 0 && a.columna > 0) {
      grid[a.fila - 1][a.columna - 1] = a;
    }
      
    });

    return grid;
  });

  ngOnInit(): void {
    this.idExcursion.set(this.excursionId());
    this.cargarMapaAsientos();
    
    console.log(`id recibido ${this.idExcursion()}`)

    if (this.pisosDisponibles().length > 0) {
      this.pisoActivo.set(this.pisosDisponibles()[0]);
    }
  }

  seleccionarPasajero(pasajero: PasajeroPendienteDTO) {
    if (this.pasajeroSeleccionado()?.reservaClienteId === pasajero.reservaClienteId) {
      this.pasajeroSeleccionado.set(null); // Deseleccionar
    } else {
      this.pasajeroSeleccionado.set(pasajero);
    }
  }

  seleccionarAsiento(asiento: AsientoMapaDTO) {
    // Si el espacio es Vacio o ya está Ocupado, no se puede asignar directamente
    if (asiento.tipoAsiento === TipoAsiento.Vacio || asiento.ocupado) return;

    const pasajero = this.pasajeroSeleccionado();
    if (!pasajero) {
      alert('Por favor, selecciona primero un pasajero de la lista izquierda.');
      return;
    }

    this.asignarAsientoAlPasajero(pasajero, asiento);
  }

  asignarAsientoAlPasajero(pasajero: PasajeroPendienteDTO, asiento: AsientoMapaDTO) {
    const payload: AsignarAsientoRequestDTO = {
      excursionId: this.excursionId(),
      asientoId: asiento.id,
      reservaClienteId: pasajero.reservaClienteId
    };

    this.guardando.set(true);

    this.asignacionesAsientosService.asignarAsiento(payload).subscribe({
      next: (resp: any) => {
        this.alertas.showAlert(`Asiento ${asiento.numeroAsiento} asignado a ${pasajero.nombreCliente} ${pasajero.apellidoCliente}`, 'exito', 'Asignación Exitosa', 3000);
      },
      error: (err :any) => {
        return;
      }
    })
   
      // 1. Actualizar asiento en el mapa local
      const mapaActualizado = this.mapaAsientos().map(a => {
        if (a.id === asiento.id) {
          return {
            ...a,
            ocupado: true,
            reservaClienteId: pasajero.reservaClienteId,
            nombreCliente: pasajero.nombreCliente
          };
        }
        return a;
      });
      this.mapaAsientos.set(mapaActualizado);

      // 2. Remover pasajero de la lista de pendientes
      const pendientesActualizados = this.pasajerosPendientes().filter(
        p => p.reservaClienteId !== pasajero.reservaClienteId
      );
      this.pasajerosPendientes.set(pendientesActualizados);

      // 3. Limpiar selección
      this.pasajeroSeleccionado.set(null);
      this.guardando.set(false);
   
  }

  volver() : void {
    this.location.back();
  }

  cargarMapaAsientos(): void {
    this.cargando.set(true);

    this.asignacionesAsientosService.obtenerMapaAsientos(this.idExcursion()).subscribe({
      next: (resp: MapaExcursionResponseDTO) => {
        this.mapaExcursion.set(resp);
        this.mapaAsientos.set(resp.asientos);
        this.pasajerosPendientes.set(resp.pasajerosPendientes);
        this.cargando.set(false);
      },
      error: (err: any) => {
        this.cargando.set(false);
        this.router.navigate(["/excursiones"]);
      }
    })
  }
}