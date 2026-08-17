import { Component,EventEmitter, Output,Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Destino,CrearDestino } from '../../../models/destino.model';

@Component({
  selector: 'app-destino-formulario',
  imports: [CommonModule, FormsModule],
  templateUrl: './destino-formulario.html',
  styleUrl: './destino-formulario.css',
})

export class DestinoFormulario {
  // Evento para emitir el objeto con los datos al padre
  @Output() guardar = new EventEmitter<CrearDestino>();
  
  // Evento para avisar al padre que el usuario canceló
  @Output() cerrar = new EventEmitter<void>();
  @Input() set destinoEditar(destino: Destino | null) {
    if (destino) {
      this.nuevoDestino = {
       nombre: destino.nombre,
        ciudad: destino.ciudad,
       idPais: destino.idPais,
       descripcion: destino.descripcion
      };
    }
} 

  // Objeto donde se guardarán los campos del formulario
  nuevoDestino: CrearDestino = {
  nombre: '',
  ciudad: '',
  idPais:0,
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
}

