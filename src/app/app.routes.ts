import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login.component/login.component';
import { LayoutComponent } from './pages/layout.component/layout.component';
import { authGuard } from './services/auth.service/auth.guard';

export const routes: Routes = [
  // 1. Ruta Pública: Login (NO usa el layout, ocupa toda la pantalla)
  { 
    path: 'login', 
    component: LoginComponent 
  },

  // 2. Rutas Privadas: Agrupadas bajo el MainLayoutComponent
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard], // El guardia protege el Layout y todo lo de adentro
    children: [
      // Todo lo que pongamos acá adentro se renderizará en el <router-outlet> del Layout

      // Redirección por defecto si entra a la raíz del sistema
      { path: '', redirectTo: '', pathMatch: 'full' }
    ]
  },

  // 3. Ruta Comodín: Si escribe cualquier fruta en la URL, lo mandamos al login
  { path: '**', redirectTo: 'login' }
];