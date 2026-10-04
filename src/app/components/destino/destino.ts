import { Component, inject, signal, OnInit } from '@angular/core';
import { Destino, CrearDestino } from '../../models/destino.model';
import { DestinoService } from '../../services/destinos.service/destino.service';
import { CommonModule } from '@angular/common';
import { DestinoFormulario } from './destino-formulario/destino-formulario';
import { ChangeDetectorRef } from '@angular/core';
import { ListaGenericaComponent, ColumnaTabla } from '../lista-generica.component/lista-generica.component'
import { ModalGenericoComponent } from '../modal-generico/modal-generico';
import { PaisesService } from '../../services/paises.service/paises.service';

@Component({
  selector: 'app-destino',
  imports: [ListaGenericaComponent, CommonModule, DestinoFormulario, ModalGenericoComponent],
  templateUrl: './destino.html',
  styleUrl: './destino.css',
})
export class DestinoComponent implements OnInit {

  private destinoService = inject(DestinoService);
  private paisesService = inject(PaisesService);

  destinos = signal<Destino[]>([]);
  cargando = signal<boolean>(false);
  cursor = signal<number | null>(null);
  hayMas = signal(true);

  mostrarFormulario: boolean = false;
  destinoEditando: Destino | null = null;

  columnas: ColumnaTabla<Destino>[] = [
    { header: 'ID', field: 'id', tipo: 'id' },
    { header: 'Nombre', field: 'nombre', tipo: 'texto' },
    { header: 'Ciudad', field: 'ciudad', tipo: 'texto' },
    { header: 'Pais', field: 'nombrePais', tipo: 'texto' },
    { header: 'Descripcion', field: 'descripcion', tipo: 'texto' },
  ]
  ngOnInit(): void {
    this.cargarDestinosInicial();
  }
  obtenerDestinos(): void {
    this.paisesService.getPaises().subscribe({
      next: (paises) => {

        this.destinoService.obtenerDestinos().subscribe({
          next: (destinos) => {

            const destinosConPais = destinos.map(destino => ({
              ...destino,
              nombrePais: paises.find(
                pais => pais.id === destino.idPais
              )?.nombrePais ?? 'Sin país'
            }));

            this.destinos.set(destinosConPais);
          },
          error: (error) => {
            console.error('Error al obtener destinos:', error);
          }
        });

      },
      error: (error) => {
        console.error('Error al obtener países:', error);
      }
    });
  }

  eliminarDestino(destino: Destino): void {
    this.destinoService.eliminarDestino(destino.id).subscribe({
      next: () => {
        console.log('Destino eliminado correctamente');
        this.obtenerDestinos();
      },
      error: (error) => {
        console.error('Error al eliminar destino:', error);
      }
    });
  }
  crearDestino(destino: CrearDestino): void {

    this.destinoService.crearDestino(destino).subscribe({
      next: (destinoCreado) => {
        console.log('Destino creado correctamente:', destinoCreado);
        this.mostrarFormulario = false;

        this.obtenerDestinos();
      },
      error: (error) => {
        console.error('Error al crear destino:', error);
      }
    });
  }
  editarDestino(destino: Destino): void {
    this.destinoEditando = destino;
    this.mostrarFormulario = true;
  }

  guardarDestino(datos: CrearDestino): void {


  if (this.destinoEditando) {

    this.destinoService
      .editarDestino(this.destinoEditando.id, datos)
      .subscribe({
        next: respuesta => {
          this.finalizarFormulario();
        },
        error: err => {
          console.error('❌ ERROR EDITANDO:', err);
        }
      });

  } else {

    this.destinoService.crearDestino(datos).subscribe({
      next: () => this.finalizarFormulario(),
      error: err => console.error(err)
    });

  }
}

  private finalizarFormulario(): void {
    this.mostrarFormulario = false;
    this.destinoEditando = null;
    this.obtenerDestinos();
  }

  borrarPorId(destino: Destino): void {

    const confirmado = confirm(
      `¿Está seguro que quiere eliminar el destino "${destino.nombre}"?`
    );

    if (!confirmado) {
      return;
    }

    this.destinoService.eliminarDestino(destino.id).subscribe({

      next: () => {
        console.log('✅ Destino eliminado correctamente');

        this.obtenerDestinos();
      },

      error: (error) => {
        console.error('❌ Error al eliminar destino:', error);
      }

    });

  }

  cargarDestinos(): void {

  if (this.cargando() || !this.hayMas()) {
    return;
  }

  this.cargando.set(true);

  this.paisesService.getPaises().subscribe({
    next: (paises) => {

      this.destinoService
        .obtenerDestinosPaginado(this.cursor())
        .subscribe({
          next: (pagina) => {

            const destinosConPais = pagina.elementos.map(destino => ({
              ...destino,
              nombrePais: paises.find(
                pais => pais.id === destino.idPais
              )?.nombrePais ?? 'Sin país'
            }));

            this.destinos.update(destinosActuales => [
              ...destinosActuales,
              ...destinosConPais
            ]);

            this.cursor.set(pagina.siguienteCursor);
            this.hayMas.set(pagina.hayMas);
            this.cargando.set(false);
          },

          error: (error) => {
            console.error('Error al obtener destinos:', error);
            this.cargando.set(false);
          }
        });

    },

    error: (error) => {
      console.error('Error al obtener países:', error);
      this.cargando.set(false);
    }
  });
}
cargarDestinosInicial(): void {
  this.destinos.set([]);
  this.cursor.set(null);
  this.hayMas.set(true);

  this.cargarDestinos();
}

}