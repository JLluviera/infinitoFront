import { Injectable, signal } from '@angular/core';

export type TipoAlerta = 'exito' | 'error' | 'info' | 'advertencia' | 'confirmacion';

export interface Alerta {
  id: string;
  tipo: TipoAlerta;
  titulo?: string;
  mensaje: string;
  duracion?: number;
  resolve?: (value: boolean) => void;
}

@Injectable({
  providedIn: 'root'
})

export class AlertService {
  // Signal que contiene las alertas activas
  alerts = signal<Alerta[]>([]);

  showAlert(mensaje: string, tipo: TipoAlerta = 'info', titulo?: string, duracion: number = 3000) {
    const id = crypto.randomUUID();
    const newAlert: Alerta = { id, tipo, titulo, mensaje, duracion };
    console.log(`Mostrando alerta: ${JSON.stringify(newAlert)}`);


    this.alerts.update(current => [...current, newAlert]);

    // Auto-cierre si no es de confirmación y tiene duración
    if (duracion > 0) {
      setTimeout(() => this.removeAlert(id), duracion);
    }
  }

  // Retorna una Promesa para poder usar await en el componente que lo llama
  confirm(mensaje: string, titulo: string = '¿Estás seguro?'): Promise<boolean> {
    return new Promise((resolve) => {
      const id = crypto.randomUUID();
      this.alerts.update(current => [
        ...current, 
        { id, tipo: 'confirmacion', titulo, mensaje, resolve }
      ]);
    });
  }

  removeAlert(id: string) {
    this.alerts.update(current => current.filter(alert => alert.id !== id));
  }
}