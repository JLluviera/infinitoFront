import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login.component/login.component';
import { LayoutComponent } from './pages/layout.component/layout.component';
import { DestinoComponent } from './components/destino/destino';
import { PaisListadoComponent } from './components/pais/pais.listado.component/pais.listado.component';

import { authGuard } from './services/auth.service/auth.guard';

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

      // Ruta por defecto
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
      }
    ]
  },

  // Cualquier ruta que no exista
  {
    path: '**',
    redirectTo: 'login'
  }
];