import { Component, inject } from '@angular/core';
import { PaisesService } from '../../../services/paises.service/paises.service';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Pais } from '../../../models/pais.model';
import { paisBotonAgregarComponent } from "../pais.boton-agregar.component/pais.boton-agregar.component";


@Component({
  selector: 'app-pais.listado.component',
  imports: [CommonModule, paisBotonAgregarComponent],
  templateUrl: './pais.listado.component.html',
  styleUrl: './pais.listado.component.css',
})
export class PaisListadoComponent {
  paises$: Observable<Pais[]>;

  constructor(private paisesService: PaisesService) {
    this.paises$ = this.paisesService.getPaises();
  }
}
