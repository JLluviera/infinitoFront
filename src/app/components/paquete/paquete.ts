import { Component, inject, signal } from '@angular/core';
import { PaquetesService } from '../../services/paquetes.service/paquetes.service';
import { Paquete } from '../../models/paquete.model';
import { ListaGenericaComponent} from '../lista-generica.component/lista-generica.component';
import { ColumnaTabla } from '../lista-generica.component/lista-generica.component';
import { BotonAgregarPaqueteComponent } from './boton-agregar-paquete/boton-agregar-paquete';
import { BotonEditarPaqueteComponent } from './boton-editar-paquete/boton-editar-paquete';
import { DestinoService } from '../../services/destinos.service/destino.service';

@Component({
  selector: 'app-paquete',
  imports: [ListaGenericaComponent,BotonAgregarPaqueteComponent, BotonEditarPaqueteComponent],
  templateUrl: './paquete.html',
  styleUrl: './paquete.css'
})
export class PaqueteComponent {

  private paquetesService = inject(PaquetesService);
  private destinoService = inject(DestinoService);

  paquetes = signal<Paquete[]>([]);

  columnas: ColumnaTabla<Paquete>[] = [
    { header: 'ID', field: 'id', tipo: 'id' },
    { header: 'Nombre', field: 'nombre', tipo: 'texto' },
    { header: 'Precio', field: 'precio', tipo: 'texto' },
    { header: 'Seña', field: 'seña', tipo: 'texto' },
    { header: 'Destino', field: 'nombreDestino', tipo: 'texto' },
    { header: 'Descripción', field: 'descripcion', tipo: 'texto' }
  ];

  constructor() {
    this.obtenerPaquetes();
  }

  obtenerPaquetes(): void {

  this.paquetesService.obtenerPaquetes().subscribe({

    next: (paquetes) => {

      this.destinoService.obtenerDestinos().subscribe({

        next: (destinos) => {

          const paquetesConDestino = paquetes.map(paquete => {

            const destino = destinos.find(
              d => d.id === paquete.idDestino
            );

            return {
              ...paquete,

              nombreDestino: destino
                ? destino.nombre
                : 'Destino no encontrado'
            };

          });

          this.paquetes.set(paquetesConDestino);

        },

        error: (error) => {
          console.error('Error al obtener los destinos:', error);
        }

      });

    },

    error: (error) => {
      console.error('Error al obtener los paquetes:', error);
    }

  });
}

  recargarPaquetes(): void {
    this.obtenerPaquetes();
  }

  eliminarPaquete(paquete: Paquete): void {

    const confirmar = confirm(
      `¿Desea eliminar el paquete "${paquete.nombre}"?`
    );

    if (!confirmar) {
      return;
    }

    this.paquetesService.eliminarPaquete(paquete.id).subscribe({
      next: () => {
        this.obtenerPaquetes();
      },
      error: (error) => {
        console.error('Error al eliminar el paquete:', error);
      }
    });
  }

  paqueteSeleccionado: Paquete | null = null;
mostrarEdicion = false;

editarPaquete(paquete: Paquete): void {
  this.paqueteSeleccionado = paquete;
  this.mostrarEdicion = true;
}

cerrarEdicion(): void {
  this.mostrarEdicion = false;
  this.paqueteSeleccionado = null;
}

finalizarEdicion(): void {
  this.cerrarEdicion();
  this.obtenerPaquetes();
}
}