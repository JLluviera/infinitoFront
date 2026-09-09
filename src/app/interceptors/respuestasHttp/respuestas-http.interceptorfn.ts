import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import {catchError, throwError} from 'rxjs';
import { AlertService } from '../../services/alert.service/alert-service'

export const respuestasHttpInterceptorfn : HttpInterceptorFn = (req, next) => {
    const alertas = inject(AlertService);

    return (next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let mensaje='';
            
            if(error.error instanceof ErrorEvent){
                mensaje = error.error.message || 'Error de conexión a internet.';
            } else {
                if (typeof error.error === 'string') {
                    mensaje = error.error;
                } else if (error.error?.message) {
                mensaje = error.error.message;
                } else if (error.error?.detail) {
                mensaje = error.error.detail;
                } else {
                mensaje = error.message || 'Ocurrió un error inesperado en el servidor.';
                }
            }

            const mensajeLimpio = truncarTexto(mensaje, 200);  //Recortamos a 200 caracteres para evitar alertas demasiado largas

            const statusCode = error.status ? `[Error ${error.status}] ` : '[Error de red]';
            const titulo = getStatusTitle(error.status);

            alertas.showAlert(mensajeLimpio, 'error', titulo, 6000)

            return throwError(() => error);
        })
    ))
}

function truncarTexto(text: string, maxLength: number): string {
  if (!text) return 'Sin descripción disponible.';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

function getStatusTitle(status: number): string {
  switch (status) {
    case 0:
      return '[Error de Red] Sin conexión';
    case 400:
      return '[Error 400] Solicitud incorrecta';
    case 401:
      return '[Error 401] Sesión no válida o expirada';
    case 403:
      return '[Error 403] Acceso denegado';
    case 404:
      return '[Error 404] Recurso no encontrado';
    case 409:
      return '[Error 409] Conflicto de datos';
    case 422:
      return '[Error 422] Datos no válidos';
    case 500:
      return '[Error 500] Error interno del servidor';
    case 503:
      return '[Error 503] Servicio no disponible';
    default:
      return status > 0 ? `[Error ${status}]` : '[Error Inesperado]';
  }
}