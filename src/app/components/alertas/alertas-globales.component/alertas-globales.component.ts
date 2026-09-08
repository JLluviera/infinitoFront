import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService, Alerta } from '../../../services/alert.service/alert-service';

@Component({
  selector: 'app-alertas-globales',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alertas-globales.component.html',
  host: {
    'style': 'display: contents;'
  },
  styleUrl: './alertas-globales.component.css'
  
})
export class AlertasGlobalesComponent {
  alertService = inject(AlertService);

// Signal derivado: Evalúa en tiempo real si existe al menos una alerta del tipo 'confirm'
  hasConfirmAlert = computed(() => 
    this.alertService.alerts().some(alert => alert.tipo === 'confirmacion')
  );

  resolveConfirm(alert: Alerta, result: boolean) {
    if (alert.resolve) {
      alert.resolve(result);
    }
    this.alertService.removeAlert(alert.id);
  }

  getAlertStyle(type: string): string {
    const base = "dark:bg-slate-800 bg-white dark:border-slate-700 border-gray-100 dark:text-white text-gray-800 ";
    switch (type) {
      case 'success': return base + 'border-l-4 border-l-green-500';
      case 'error': return base + 'border-l-4 border-l-red-500';
      case 'warning': return base + 'border-l-4 border-l-yellow-500';
      case 'confirm': return base + 'border-l-4 border-l-blue-500 ring-4 ring-black/5 dark:ring-white/5';
      default: return base + 'border-l-4 border-l-gray-400';
    }
  }
}