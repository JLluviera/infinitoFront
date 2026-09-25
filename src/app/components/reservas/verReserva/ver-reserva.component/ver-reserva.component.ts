import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { AlertService } from '../../../../services/alert.service/alert-service';
import { ReservasService } from '../../../../services/reservas.service/reservas.service';
import { ReservaModel } from '../../../../models/reserva.model';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { EstadoReserva } from '../../../../models/reserva.model';

@Component({
  selector: 'app-ver-reserva',
  imports: [CommonModule,RouterLink],
  templateUrl: './ver-reserva.component.html',
  styleUrl: './ver-reserva.component.css',
})
export class VerReservaComponent implements OnInit{
  idReserva = input.required<number>();
  reserva = signal<ReservaModel | null>(null);
  cargando = signal<boolean>(false);
  idRes = signal<number>(0);

  readonly EstadoReserva = EstadoReserva;

  private alertas = inject(AlertService);
  private reservaService = inject(ReservasService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    // Escuchar parámetros por si el usuario cambia de reserva sin destruir el componente
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id && !isNaN(id)) {
        this.cargarReserva(id);
        this.idRes.set(id);
      } else {
        console.error('El ID de la reserva no es válido');
      }
    });
  }

  cargarReserva(id: number){
    this.reservaService.getReservaPorId(id).subscribe({
      next: (reserva: any) =>{
        this.reserva.set(reserva);
      }
    })
  }

  anularReserva(){
    setTimeout(async () => {
      const confirmado = await this.alertas.confirm(
        `¿Estás seguro de que deseas anular la reserva #${this.idRes()}?
        En caso de haber recibido pagos por esta reserva, esta acción generará un saldo positivo para que el cliente pueda usar en el futuro.`,
        'Anular Reserva'
      );

      // Evaluamos la respuesta del usuario
      if (confirmado) {
        this.reservaService.anularReserva(this.idRes()).subscribe({
          next: (resp: any) =>{
            this.alertas.showAlert('La reserva ha sido cancelada.', 'exito', 'Operación completada', 3000);
            this.router.navigate(['/reserva'])
          }
          //en caso de error el HttpInterceptor lo mostrará correctamente
        })
      } else {
        this.alertas.showAlert('Operación abortada, la reserva sigue intacta.', 'info', 'Acción cancelada', 3000);
      }
    }, 1500);
  }

  cancelarReserva(){
    setTimeout(async () => {
      const confirmado = await this.alertas.confirm(
        `¿Estás seguro de que deseas cancelar la reserva #${this.idRes()}?
        Si el cliente tiene pagos para esta reserva, se anularán en el sistema y no le generará ningún saldo a favor
        Esta acción no se puede deshacer.`,
        'Cancelar Reserva'
      );

      // Evaluamos la respuesta del usuario
      if (confirmado) {
        this.reservaService.cancelarReserva(this.idRes()).subscribe({
          next: (resp: any) => {
            this.alertas.showAlert('La reserva ha sido cancelada.', 'exito', 'Operación completada', 3000);
            this.router.navigate(['/reservas']);
          }
          // En caso de error el HTTP Interceptor lo mostrará correctamente
        })
      } else {
        this.alertas.showAlert('Operación abortada, la reserva sigue intacta.', 'info', 'Acción cancelada', 3000);
      }
    }, 1500);
  }
}
