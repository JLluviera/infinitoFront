import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { AlertService } from '../../../../services/alert.service/alert-service';
import { ReservasService } from '../../../../services/reservas.service/reservas.service';
import { ReservaModel } from '../../../../models/reserva.model';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';

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

  private alertas = inject(AlertService);
  private reservaService = inject(ReservasService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    // Escuchar parámetros por si el usuario cambia de reserva sin destruir el componente
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id && !isNaN(id)) {
        this.cargarReserva(id);
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

  anularReserva(id:number){

  }

  cancelarReserva(id:number){
    
  }
}
