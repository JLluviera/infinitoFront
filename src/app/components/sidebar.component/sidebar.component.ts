import { Component, EventEmitter, Input, Output, Renderer2, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  host: { class: 'contents' }
})
export class SidebarComponent {
  private document = inject(DOCUMENT);
  private renderer = inject(Renderer2);

  isDarkMode = false; 

  // Recibe el estado desde el layout principal (para móviles)
  @Input() isOpen: boolean = false;
  
  // Emite un evento para cerrar el menú en móviles si el usuario hace clic en el fondo
  @Output() closeSidebar = new EventEmitter<void>();

  onClose(): void {
    this.closeSidebar.emit();
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      this.renderer.addClass(this.document.body, 'dark');
    } else {
      this.renderer.removeClass(this.document.body, 'dark');
    }
  }
}