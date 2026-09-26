import { Component, inject, input, Input, OnInit, signal } from '@angular/core';
import { ReservasService } from '../../../../services/reservas.service/reservas.service';
import { ReservaList } from '../../../../models/reserva.model';
import { AlertService } from '../../../../services/alert.service/alert-service';
import { ColumnaTabla, ListaGenericaComponent } from '../../../lista-generica.component/lista-generica.component';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-listado-reservas',
  imports: [ListaGenericaComponent, RouterLink],
  templateUrl: './listado-reservas.html',
  styleUrl: './listado-reservas.css',
})
export class ListadoReservas implements OnInit {
  private servicioReservas = inject(ReservasService)
  private alertas = inject(AlertService);
  private router = inject(Router);

  idExcursion = input<number>();
  reservas = signal<ReservaList[]>([]);

  columnas: ColumnaTabla<ReservaList>[] = [
    { header: 'ID', field: 'id', tipo: 'id' },
    { header: 'IDExcursion', field: 'idExcursion', tipo: 'id' },
    { header: 'NombreCliente ', field: 'nombreCliente', tipo: 'texto' },
    { header: 'ApellidoCliente ', field: 'apellidoCliente', tipo: 'texto' },
    { header: 'Cedula', field: 'ciCliente', tipo: 'link' },
    { header: 'Estado', field: 'estadoReserva', tipo: 'texto' },
  ]

  ngOnInit(): void {
    console.log("Componente iniciado");
    this.cargarReservas(this.idExcursion());
  }

  verReserva(idReserva: number): void {
    if (!idReserva) return;


  }

  cargarReservas(idExcursion?: number): void {
    console.log("Cargando reservas");
    if (!(idExcursion && idExcursion > 0)) {
      this.servicioReservas.getReservasList()
        .subscribe({
          next: (Response: any) => {
            this.reservas.set(Response)
          }
        })
      return
    } else {
      this.servicioReservas.getReservasExcursiones(idExcursion!).subscribe({
        next: (Response: any) => {
          this.reservas.set(Response)
        }
      })
    }
  }
  agregarReserva(): void {
  this.router.navigate(['/reserva/crear']);
}

}

