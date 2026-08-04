import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  // Emite un evento hacia el componente padre para abrir o cerrar el sidebar
  @Output() toggleSidebar = new EventEmitter<void>();

  private authService = inject(AuthService)

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  onLogOut():void {
    this.authService.logout();
  }
}
