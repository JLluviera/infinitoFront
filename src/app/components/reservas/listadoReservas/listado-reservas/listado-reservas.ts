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

  cursor = signal<number | null>(null);
  hayMas = signal(true);
  cargando = signal(false);

  columnas: ColumnaTabla<ReservaList>[] = [
    { header: 'ID', field: 'id', tipo: 'id' },
    { header: 'IDExcursion', field: 'idExcursion', tipo: 'id' },
    { header: 'NombreCliente ', field: 'nombreCliente', tipo: 'texto' },
    { header: 'ApellidoCliente ', field: 'apellidoCliente', tipo: 'texto' },
    { header: 'Cedula', field: 'ciCliente', tipo: 'texto' },
    { header: 'Estado', field: 'estadoReserva', tipo: 'texto' },
  ]

  ngOnInit(): void {
    console.log('Componente iniciado');
    this.cargarReservasInicial();
  }

  verReserva(reserva: ReservaList): void {
  this.router.navigate(['/reserva/detalle', reserva.id]);
}

  cargarReservas(): void {

  if (this.cargando() || !this.hayMas()) {
    return;
  }

  this.cargando.set(true);

  const idExcursion = this.idExcursion() ?? null;

  this.servicioReservas
    .obtenerReservasPaginado(
      this.cursor(),
      idExcursion
    )
    .subscribe({

      next: pagina => {

        this.reservas.update(reservasActuales => [
          ...reservasActuales,
          ...pagina.elementos
        ]);

        this.cursor.set(pagina.siguienteCursor);
        this.hayMas.set(pagina.hayMas);

        this.cargando.set(false);
      },

      error: error => {

        console.error(
          'Error al obtener reservas:',
          error
        );

        this.cargando.set(false);
      }
    });
}
  agregarReserva(): void {
    this.router.navigate(['/reserva/crear']);
  }
  cargarReservasInicial(): void {

    this.reservas.set([]);
    this.cursor.set(null);
    this.hayMas.set(true);

    this.cargarReservas();
  }
  
}

