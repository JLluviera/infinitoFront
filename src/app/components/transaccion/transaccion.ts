import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { TransaccionesService } from '../../services/transaccion.service/transacciones.service';
import { Transaccion,EstadoTransaccion,FormaDePago } from '../../models/transaccion.model';
import { ListaGenericaComponent, ColumnaTabla } from '../lista-generica.component/lista-generica.component';
import { BotonAgregarTransaccionComponent } from './boton-agregar-transaccion/boton-agregar-transaccion';
import { BotonEditarTransaccionComponent } from './boton-editar-transaccion/boton-editar-transaccion/boton-editar-transaccion';
import { ClientesService } from '../../services/clientes.service/clientes.service';
import { single } from 'rxjs';
import { TransaccionesParamsDTO } from '../../models/params/transaccionesParamsDTO';



@Component({
  selector: 'app-transaccion',
  imports: [ListaGenericaComponent, BotonAgregarTransaccionComponent, BotonEditarTransaccionComponent],
  templateUrl: './transaccion.html',
  styleUrl: './transaccion.css',
})
export class TransaccionComponent implements OnInit {
  idReserva = input<number | null> (null);
  idCliente = input<number | null> (null);

  idResFiltro = input<number | null>(null);
  idClienteFiltro = input<number | null>(null);
  NombreClienteFiltro = input<string | null>(null);
  ApellidoClienteFiltro = input<string | null>(null);

  private transaccionesService = inject(TransaccionesService);
  private clientesService= inject(ClientesService);

  totalTransacciones = output<number>();

  transacciones = signal<Transaccion[]>([]);
  transaccionSeleccionada: Transaccion | null = null;
  mostrarEdicion = false;
  transaccionesParams = signal<TransaccionesParamsDTO>({});


  columnas: ColumnaTabla<Transaccion>[] = [
    { header: 'ID', field: 'id', tipo: 'id' },
    { header: 'Monto', field: 'monto', tipo: 'texto' },
    { header: 'Fecha', field: 'fechaCreacion', tipo: 'date' },
    { header: 'Forma de pago', field: 'nombreFormaPago', tipo: 'texto' },
    { header: 'Estado', field: 'nombreEstado', tipo: 'texto' },
    { header: 'Nro Reserva', field: 'idReserva', tipo: 'id' },
    { header: 'Cliente', field: 'nombreCliente', tipo: 'texto' },
  ];

  constructor() {
  }

  ngOnInit(): void {
    if (this.idReserva()){
      this.transaccionesParams.set({
        idReserva: this.idReserva()!
      })
    }

    if (this.idCliente()){
      this.transaccionesParams.set({
        idCliente: this.idCliente()!
      })
    }

    this.obtenerTransacciones();
  }

  obtenerTransacciones(): void {

  this.transaccionesService.obtenerTransacciones(this.transaccionesParams()).subscribe({

    next: (transacciones) => {
      if (this.idReserva() && transacciones){
        let total: number = 0;

        transacciones.forEach(trans => {
          if(trans.estado == EstadoTransaccion.Pago || trans.estado == EstadoTransaccion.UsoDeSaldo || trans.estado == EstadoTransaccion.DevolucionPago){
            total += trans.monto;
          } else { total -= trans.monto}
        })

        this.totalTransacciones.emit(total);
      }

      this.clientesService.obtenerClientes().subscribe({

        next: (clientes) => {

          const transaccionesConDatos = transacciones.map(transaccion => {

            const cliente = clientes.find(
              c => c.id === transaccion.idCliente
            );

            return {
              ...transaccion,

              nombreCliente: cliente
                ? `${cliente.nombre} ${cliente.apellido}`
                : 'Cliente no encontrado',

              nombreEstado:
                EstadoTransaccion[transaccion.estado],

              nombreFormaPago:
                FormaDePago[transaccion.formaDePago]
            };

          });

          this.transacciones.set(transaccionesConDatos);

        },

        error: (error) => {
          console.error('Error al obtener los clientes:', error);
        }

      });

    },

    error: (error) => {
      console.error('Error al obtener las transacciones:', error);
    }

  });
}

recargarTransacciones(): void {
  this.obtenerTransacciones();
}

  eliminarTransaccion(transaccion: Transaccion): void {
    const confirmar = confirm(
      `¿Desea eliminar la transacción con ID ${transaccion.id}?`
    );

    if (!confirmar) {
      return;
    }

    this.transaccionesService.eliminarTransaccion(transaccion.id).subscribe({
      next: () => {
        this.obtenerTransacciones();
      },
      error: (error) => {
        console.error('Error al eliminar la transacción:', error);
      }
    });
  }
  editarTransaccion(transaccion: Transaccion): void {
  this.transaccionSeleccionada = transaccion;
  this.mostrarEdicion = true;
}

cerrarEdicion(): void {
  this.mostrarEdicion = false;
  this.transaccionSeleccionada = null;
}

finalizarEdicion(): void {
  this.cerrarEdicion();
  this.obtenerTransacciones();
}
}