import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header.component/header.component';
import { SidebarComponent } from '../../components/sidebar.component/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { AlertasGlobalesComponent } from '../../components/alertas/alertas-globales.component/alertas-globales.component'
import { AlertService } from '../../services/alert.service/alert-service';

@Component({
  selector: 'app-layout.component',
  imports: [HeaderComponent, SidebarComponent, RouterOutlet, AlertasGlobalesComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
    isSidebarOpen: boolean = false;

    private alertService = inject(AlertService);

};
