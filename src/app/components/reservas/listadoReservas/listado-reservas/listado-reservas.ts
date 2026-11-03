import { Component, inject, input, Input, OnInit, signal } from '@angular/core';
import { ReservasService } from '../../../../services/reservas.service/reservas.service';
import { EstadoReserva, ReservaList } from '../../../../models/reserva.model';
import { AlertService } from '../../../../services/alert.service/alert-service';
import { ColumnaTabla, ListaGenericaComponent } from '../../../lista-generica.component/lista-generica.component';
import { RouterLink, Router } from '@angular/router';
import { ReservaParamsDTO } from '../../../../models/params/reservasParamsDTO';


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
  protected readonly EstadoReserva = EstadoReserva;
  
  rutaCrear = "'reserva/crear'";
  idExc = signal<number>(0);

  idExcursion = input<number>();
  reservas = signal<ReservaList[]>([]);

  cursor = signal<number | null>(null);
  hayMas = signal<boolean>(true);
  cargando = signal(false);

  filtroCiCliente = signal<number | null>(null);
  filtroEstadoReserva = signal<EstadoReserva | undefined>(undefined);

  reservaParams = signal<ReservaParamsDTO>({});

  columnas: ColumnaTabla<ReservaList>[] = [
    { header: 'ID', field: 'id', tipo: 'id' },
    { header: 'Excursion', field: 'idExcursion', tipo: 'link' },
    { header: 'Nombre ', field: 'nombreCliente', tipo: 'texto' },
    { header: 'Apellido ', field: 'apellidoCliente', tipo: 'texto' },
    { header: 'Cedula', field: 'ciCliente', tipo: 'texto' },
    { header: 'Estado', field: 'estadoReserva', tipo: 'texto' },
  ]

  ngOnInit(): void {
    console.log('Componente iniciado');
    this.cargarReservasInicial();
    this.idExc.set(this.idExcursion() ?? 0)
  }

  verReserva(reserva: ReservaList): void {
  this.router.navigate(['/reserva/detalle', reserva.id]);
  }

  aplicarFiltros(): void{
    this.reservaParams.set({
      ciCliente: this.filtroCiCliente() ?? undefined,
      estadoReserva: this.filtroEstadoReserva()
    })

    this.cargarReservasInicial();
  }

  borrarFiltros(): void {
    this.filtroCiCliente.set(null);
    this.filtroEstadoReserva.set(undefined);
    this.reservaParams.set({});

    this.cargarReservasInicial();
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
      idExcursion,
      this.reservaParams()
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
    this.router.navigate(['/reserva/crear', this.idExc()]);
  }
  cargarReservasInicial(): void {

    this.reservas.set([]);
    this.cursor.set(null);
    this.hayMas.set(true);

    this.cargarReservas();
  }
  
}

