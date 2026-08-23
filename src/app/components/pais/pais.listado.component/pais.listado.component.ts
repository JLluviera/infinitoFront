import { Component, inject } from '@angular/core';
import { PaisesService } from '../../../services/paises.service/paises.service';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Pais } from '../../../models/pais.model';
import { PaisBotonAgregarComponent } from "../pais.boton-agregar.component/pais.boton-agregar.component";


@Component({
  selector: 'app-pais.listado.component',
  imports: [CommonModule, PaisBotonAgregarComponent],
  templateUrl: './pais.listado.component.html',
  styleUrl: './pais.listado.component.css',
})
export class PaisListadoComponent {
  paises$: Observable<Pais[]>;

  constructor(private paisesService: PaisesService) {
    this.paises$ = this.paisesService.getPaises();
  }
  eliminarPais(id: number, nombre: string): void {
    // Dispara el mensaje emergente de confirmación na
    // tivo del navegador
    const confirmado = confirm(`¿Está seguro que quiere eliminar el país "${nombre}"?`);

    if (confirmado) {
      this.paisesService.deletePais(id).subscribe({
        next: () => {
          console.log('País eliminado correctamente');
          this.paisesService.getPaises(); // Recarga la lista en pantalla
        },
        error: (err) => {
          console.error('Error al eliminar el país:', err);
        }
      });
    }
}
}
