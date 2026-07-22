import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  host: { class: 'contents' }
})
export class SidebarComponent {
  // Recibe el estado desde el layout principal (para móviles)
  @Input() isOpen: boolean = false;
  
  // Emite un evento para cerrar el menú en móviles si el usuario hace clic en el fondo
  @Output() closeSidebar = new EventEmitter<void>();

  onClose(): void {
    this.closeSidebar.emit();
  }
}