import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  // Tienes que importar los componentes aquí para poder usarlos en el HTML
  imports: [RouterOutlet],
  templateUrl: './app.html'
})
export class App {
  // Esta variable es la que conecta el botón del Header con el Sidebar
}