import { Component, inject, signal,OnInit } from '@angular/core';
import { Destino,CrearDestino } from '../../models/destino.model';
import { DestinoService } from '../../services/destinos.service/destino.service';
import { CommonModule } from '@angular/common';
import { DestinoFormulario } from './destino-formulario/destino-formulario';
import { ChangeDetectorRef } from '@angular/core';
import { ListaGenericaComponent, ColumnaTabla } from '../lista-generica.component/lista-generica.component'

@Component({
  selector: 'app-destino',
  imports: [ListaGenericaComponent , CommonModule,DestinoFormulario],
  templateUrl: './destino.html',
  styleUrl: './destino.css',
})
export class DestinoComponent implements OnInit  {

  private destinoService = inject(DestinoService);
  private cdr = inject(ChangeDetectorRef);

  destinos = signal<Destino[]>([]);
  cargando = signal<boolean>(false);

  mostrarFormulario:boolean = false;
  destinoEditando: Destino | null = null;

  columnas: ColumnaTabla<Destino>[] = [
    { header: 'ID', field: 'id', tipo: 'id' },
    { header: 'Nombre', field: 'nombre', tipo: 'texto' },
    { header: 'Ciudad', field: 'ciudad', tipo: 'texto' },
    { header: 'Id Pais', field: 'idPais', tipo: 'id' },
    { header : 'Descripcion', field: 'descripcion', tipo: 'texto' },
  ]
ngOnInit(): void {
  this.obtenerDestinos();
}
  obtenerDestinos(): void {
    this.destinoService.obtenerDestinos().subscribe({
      
      next: (destinos) => {
        this.destinos.set(destinos);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener destinos:', error);
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
    // Modo edición
    this.destinoService.editarDestino(this.destinoEditando.id, datos).subscribe({
      next: () => this.finalizarFormulario(),
      error: (err) => console.error(err)
    });
  } else {
    // Modo creación
    
    this.destinoService.crearDestino(datos).subscribe({
      next: () => this.finalizarFormulario(),
      error: (err) => console.error(err)
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
}