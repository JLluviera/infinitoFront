import { Component, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { Cliente } from '../../../../models/cliente.model';
import { ReservasService } from '../../../../services/reservas.service/reservas.service';
import { ClientesService } from '../../../../services/clientes.service/clientes.service';

@Component({
  selector: 'app-gestionar-clientes-incluidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestionar-clientes-incluidos.component.html'
})
export class GestionarClientesIncluidos {
  // ID de la reserva inyectado desde el modal padre
  readonly reservaId = input.required<number>();
  readonly yaIncluidos = input.required<Cliente[]>();

  private readonly reservasService = inject(ReservasService);
  private readonly clientesService = inject(ClientesService);

  // Estados reactivos
  readonly cargando = signal<boolean>(true);
  readonly cargandoBusqueda = signal<boolean>(false);
  readonly clientesReserva = signal<Cliente[]>([]);
  readonly cedulaInput = signal<number>(0);
  readonly clientesSugeridos = signal<Array<Cliente & { yaIncluido: boolean }>>([]);
  readonly mostrarDropdown = signal<boolean>(false);

  private readonly searchSubject = new Subject<number>();

  constructor() {
    // Configurar flujo de autocompletado con endpoint
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.cargandoBusqueda.set(true)),
      switchMap(cedula => this.clientesService.buscadorClientesCi(this.cedulaInput()))
    ).subscribe({
      next: (resultados) => {
        const incluidosIds = new Set(this.clientesReserva().map(c => c.id));
        
        // Mapear resultados y marcar si ya están incluidos en la reserva
        const sugerenciasConEstado = resultados.map(cliente => ({
          ...cliente,
          yaIncluido: incluidosIds.has(cliente.id)
        }));

        this.clientesSugeridos.set(sugerenciasConEstado);
        this.cargandoBusqueda.set(false);
        this.mostrarDropdown.set(sugerenciasConEstado.length > 0);
      },
      error: () => {
        this.cargandoBusqueda.set(false);
        this.clientesSugeridos.set([]);
      }
    });
  }

  ngOnInit(): void {
    this.cargarClientesIniciales();
  }

  cargarClientesIniciales(): void {
    this.cargando.set(true);
    this.clientesReserva.set(this.yaIncluidos());
    this.cargando.set(false);
  }

  onCedulaInput(valor: number): void {
    this.cedulaInput.set(valor);
    if (valor > 0) {
      this.searchSubject.next(valor);
    } else {
      this.clientesSugeridos.set([]);
      this.mostrarDropdown.set(false);
    }
  }

  seleccionarCliente(cliente: Cliente & { yaIncluido: boolean }): void {
    if (cliente.yaIncluido) return;

    this.reservasService.agregarClienteAReserva(this.reservaId(), cliente.ci).subscribe({
      next: () => {
        // Actualizamos estado local agregando el cliente
        this.clientesReserva.update(lista => [...lista, cliente]);
        this.cedulaInput.set(0);
        this.mostrarDropdown.set(false);
        this.clientesSugeridos.set([]);
      },
      error: (err) => {
        console.error('Error al agregar cliente a la reserva', err);
      }
    });
  }

  removerCliente(clienteId: number): void {
    this.reservasService.removerClienteDeReserva(this.reservaId(), clienteId).subscribe({
      next: () => {
        this.clientesReserva.update(lista => lista.filter(c => c.id !== clienteId));
      },
      error: (err) => {
        console.error('Error al remover cliente', err);
      }
    });
  }
}