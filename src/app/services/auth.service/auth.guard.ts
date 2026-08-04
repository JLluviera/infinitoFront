import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  // Inyectamos el servicio y el enrutador
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificamos el estado usando el Signal que creamos
  if (authService.isAuthenticated()) {
    return true; // El usuario tiene token, lo dejamos pasar
  } 

  // No está autenticado, lo mandamos al login
  router.navigate(['/login']);
  return false;
};