import { Component, EventEmitter, Output, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Destino, CrearDestino } from '../../../models/destino.model';
import { ModalGenericoComponent } from '../../modal-generico/modal-generico';
import { Pais } from '../../../models/pais.model';
import { PaisesService } from '../../../services/paises.service/paises.service';

@Component({
  selector: 'app-destino-formulario',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalGenericoComponent],
  templateUrl: './destino-formulario.html',
  styleUrl: './destino-formulario.css',
})

export class DestinoFormulario {
  private paisesService = inject(PaisesService);
  paises: Pais[] = [];
  constructor(){
    this.obtenerPaises();
  }


  // Evento para emitir el objeto con los datos al padre
  @Output() guardar = new EventEmitter<CrearDestino>();

  // Evento para avisar al padre que el usuario canceló
  @Output() cerrar = new EventEmitter<void>();
  private _destinoEditar: Destino | null = null;

  @Input()
  set destinoEditar(destino: Destino | null) {

    this._destinoEditar = destino;

    if (destino) {

      this.nuevoDestino = {
        nombre: destino.nombre,
        ciudad: destino.ciudad,
        idPais: destino.idPais,
        descripcion: destino.descripcion
      };

    } else {

      this.nuevoDestino = {
        nombre: '',
        ciudad: '',
        idPais: 0,
        descripcion: ''
      };

    }

  }

  get destinoEditar(): Destino | null {
    return this._destinoEditar;
  }

  // Objeto donde se guardarán los campos del formulario
  nuevoDestino: CrearDestino = {
    nombre: '',
    ciudad: '',
    idPais: 0,
    descripcion: ''
  };

  // Método que se ejecuta al presionar "Guardar"
  onSubmit() {
    if (this.nuevoDestino.nombre.trim()) {
      // Emitimos los datos capturados hacia el padre
      this.guardar.emit(this.nuevoDestino);
    }
  }

  // Método para cancelar
  onCerrar() {
    this.cerrar.emit();
  }

  obtenerPaises(): void {

  this.paisesService.getPaises().subscribe({

    next: (paises) => {
      console.log('✅ PAÍSES RECIBIDOS PARA EL SELECT:', paises);
      this.paises = paises;
    },

    error: (error) => {
      console.error('❌ ERROR AL OBTENER PAÍSES:', error);
    }

  });

}

}

