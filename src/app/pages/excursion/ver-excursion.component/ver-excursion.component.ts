import { Component, input, signal, effect, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Excursion } from '../../../models/excursion.model';
import { ExcursionService } from '../../../services/excursiones.service/excursion.service';
import { ExcursionBotonEditarComponent } from '../../../components/excursion/excursion.boton.editar/excursion.boton.editar';
import { AlertService } from '../../../services/alert.service/alert-service';

@Component({
  selector: 'app-ver-excursion',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink, ExcursionBotonEditarComponent],
  templateUrl: './ver-excursion.component.html'
})
export class VerExcursionComponent {
  // Recibe el 'id' automáticamente desde la ruta
  idExcursion = input.required<string>({ alias: 'id' });
  mostrarEdicion=signal(false)
  private router = inject(Router);
  excursionService = inject(ExcursionService);
  excursion = signal<Excursion | null>(null);
  cargando = signal<boolean>(true);
  error = signal<string | null>(null);

  alertas = inject(AlertService);

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

      this.lanzarAlertasDePrueba();
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
  editarExcursion(): void {
  this.mostrarEdicion.set(true);
}
cerrarEdicion(): void {
  this.mostrarEdicion.set(false);
}

finalizarEdicion(): void {
  this.mostrarEdicion.set(false);

  const id = this.idExcursion();

  if (id) {
    this.obtenerDetalleExcursion(id);
  }
}

async lanzarAlertasDePrueba() {
    // 1. Alerta de Información (desaparece en 4 segundos)
    this.alertas.showAlert(
      'Bienvenido al sistema de gestión de Infinito Viajes.', 
      'info', 
      '¡Hola de nuevo!', 
      4000
    );

    // 2. Alerta de Éxito (aparece al segundo, desaparece en 5s)
    setTimeout(() => {
      this.alertas.showAlert(
        'El paquete turístico a Bariloche se actualizó correctamente.', 
        'exito', 
        'Guardado con éxito', 
        5000
      );
    }, 1000);

    // 3. Alerta de Advertencia (Aparece a los 2s. Duración 0 = NO se cierra sola, el usuario debe cerrarla de la "X")
    setTimeout(() => {
      this.alertas.showAlert(
        'Hay 3 reservas pendientes de pago que vencen hoy.', 
        'advertencia', 
        'Atención requerida', 
        0 
      );
    }, 2000);

    // 4. Alerta de Error (aparece a los 3s)
    setTimeout(() => {
      this.alertas.showAlert(
        'No se pudo conectar con el proveedor de vuelos. Intenta de nuevo.', 
        'error', 
        'Error de sincronización', 
        6000
      );
    }, 3000);

    // 5. Cuadro de Confirmación (aparece a los 4s y frena el código hasta que el usuario decida)
    setTimeout(async () => {
      const confirmado = await this.alertas.confirm(
        '¿Estás seguro de que deseas cancelar la reserva #8472? Esta acción no se puede deshacer.',
        'Cancelar Reserva'
      );

      // Evaluamos la respuesta del usuario
      if (confirmado) {
        this.alertas.showAlert('La reserva ha sido cancelada.', 'exito', 'Operación completada', 3000);
      } else {
        this.alertas.showAlert('Operación abortada, la reserva sigue intacta.', 'info', 'Acción cancelada', 3000);
      }
    }, 4500);
  }
}