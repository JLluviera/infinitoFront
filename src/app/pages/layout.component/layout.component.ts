import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header.component/header.component';
import { SidebarComponent } from '../../components/sidebar.component/sidebar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout.component',
  imports: [HeaderComponent, SidebarComponent, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
    isSidebarOpen: boolean = false;

}
