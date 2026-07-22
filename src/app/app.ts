import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// Ajusta estas rutas dependiendo de dónde guardaste los componentes
import { HeaderComponent } from './components/header.component/header.component';
import { SidebarComponent } from './components/sidebar.component/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  // Tienes que importar los componentes aquí para poder usarlos en el HTML
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './app.html'
})
export class AppComponent {
  // Esta variable es la que conecta el botón del Header con el Sidebar
  isSidebarOpen: boolean = false;
}