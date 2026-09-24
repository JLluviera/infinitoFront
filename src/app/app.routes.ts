import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login.component/login.component';
import { LayoutComponent } from './pages/layout.component/layout.component';
import { DestinoComponent } from './components/destino/destino';
import { PaisListadoComponent } from './components/pais/pais.listado.component/pais.listado.component';
import { ExcursionComponent } from './components/excursion/excursion';
import { VerExcursionComponent } from './pages/excursion/ver-excursion.component/ver-excursion.component';
import { ClienteComponent } from './components/cliente/cliente';
import { ListadoReservas } from './components/reservas/listadoReservas/listado-reservas/listado-reservas'
import { authGuard } from './services/auth.service/auth.guard';
import { CrearReservaComponent } from './components/reservas/crear-reserva.component/crear-reserva.component';
import { ModalCrearReservaComponent } from './components/reservas/modalCrearReserva.component/modal-crear-reserva.component/modal-crear-reserva.component';
import { TransaccionComponent } from './components/transaccion/transaccion';
import { DetalleClienteComponent } from './components/cliente/detalle-cliente/detalle-cliente/detalle-cliente';
import { VerReservaComponent } from './components/reservas/verReserva/ver-reserva.component/ver-reserva.component';
import { PaqueteComponent } from './components/paquete/paquete';

export const routes: Routes = [

  // Ruta pública: Login
  {
    path: 'login',
    component: LoginComponent
  },

  // Rutas privadas
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],

    children: [

      // Destinos
      {
        path: 'destinos',
        component: DestinoComponent
      },

      // Paises
      {
        path: 'paises',
        component: PaisListadoComponent
      },
      //Excursiones
      {
        path: 'excursiones',
        component: ExcursionComponent,

      },

      {
        path: 'excursiones/detalle/:id',
        component: VerExcursionComponent
      },
      {
        path: 'clientes',
        component: ClienteComponent
      },
      {
        path: 'clientes/detalle/:id',
        component: DetalleClienteComponent
      },
      // Reservas
      {
        path: 'reserva',
        component: ListadoReservas
      },
      {
        path: 'reserva/detalle/:id',
        component: VerReservaComponent
      },
      // Transaccion
      {
        path: 'transacciones',
        component: TransaccionComponent
      },
      // Paquete
      {
        path: 'paquetes',
        component: PaqueteComponent
      },
      // Ruta por defecto
      {
        path: '',
        redirectTo: 'excursiones',
        pathMatch: 'full'
      }
    ]
  },

  // Cualquier ruta que no exista
  {
    path: '**',
    redirectTo: 'excursiones'
  }
];