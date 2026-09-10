import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pais } from '../../../models/pais.model';
import { PaisesService } from '../../../services/paises.service/paises.service';
import { PaisBotonAgregarComponent } from '../pais.boton-agregar.component/pais.boton-agregar.component';
import { ColumnaTabla, ListaGenericaComponent } from '../../lista-generica.component/lista-generica.component';
import { PaisBotonEditarComponent } from '../pais.boton.editar/pais.boton.editar';
@Component({
  selector: 'app-pais.listado.component',
  standalone: true,
  imports: [CommonModule, PaisBotonAgregarComponent, ListaGenericaComponent, PaisBotonEditarComponent],
  templateUrl: './pais.listado.component.html',
  styleUrl: './pais.listado.component.css'
})
export class PaisListadoComponent {

  paises = signal<Pais[]>([]);
  paisSeleccionado: Pais | null = null;
  mostrarEdicion = false;

  columnas: ColumnaTabla<Pais>[] = [
    { header: 'ID', field: 'id', tipo: 'id' },
    { header: 'Nombre', field: 'nombrePais', tipo: 'texto' },
    { header: 'Código', field: 'codigoPais', tipo: 'texto' }
  ];

  constructor(private paisesService: PaisesService) {

    this.obtenerPaises();

  }


  obtenerPaises(): void {

    this.paisesService.getPaises().subscribe({

      next: (paises) => {

        console.log('✅ PAÍSES RECIBIDOS:', paises);

        this.paises.set(paises);

      },

      error: (error) => {

        console.error(
          '❌ Error al obtener países:',
          error
        );

      }

    });

  }


  recargarPaises(): void {

    this.obtenerPaises();

  }


  eliminarPais(id: number, nombre: string): void {

    const confirmado = confirm(
      `¿Está seguro que quiere eliminar el país "${nombre}"?`
    );

    if (!confirmado) {
      return;
    }

    this.paisesService.deletePais(id).subscribe({

      next: () => {

        console.log('✅ País eliminado correctamente');

        this.obtenerPaises();

      },

      error: (error) => {

        console.error(
          '❌ Error al eliminar país:',
          error
        );

      }

    });

  }
  editarPais(pais: Pais): void {

    this.paisSeleccionado = pais;
    this.mostrarEdicion = true;

  }
  cerrarEdicion(): void {

    this.mostrarEdicion = false;
    this.paisSeleccionado = null;

  }
  finalizarEdicion(): void {

    this.mostrarEdicion = false;
    this.paisSeleccionado = null;

    this.recargarPaises();

  }

}