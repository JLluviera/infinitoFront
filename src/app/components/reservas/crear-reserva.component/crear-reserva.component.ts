import { Component, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { ReservasService } from '../../../services/reservas.service/reservas.service';
import { ClientesService } from '../../../services/clientes.service/clientes.service';
import { PaquetesService } from '../../../services/paquetes.service/paquetes.service';
import { ExcursionService } from '../../../services/excursiones.service/excursion.service';
import { AlertService } from '../../../services/alert.service/alert-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { ReservaCrearModel } from '../../../models/reserva-crear.model';
import { Excursion } from '../../../models/excursion.model';
import { SelectGenericoComponent } from '../../select-generico/select-generico';
import { PaqueteComponent } from '../../paquete/paquete';
import { Cliente } from '../../../models/cliente.model';
import { ClienteBotonAgregarComponent } from '../../cliente/cliente.boton.agregar/cliente.boton.agregar';

@Component({
  selector: 'app-crear-reserva',
  standalone: true,
  // SACAMOS el SelectGenericoComponent de los imports
  imports: [CommonModule, ReactiveFormsModule, SelectGenericoComponent,ClienteBotonAgregarComponent], 
  templateUrl: './crear-reserva.component.html',
  styleUrl: './crear-reserva.component.css',
})
export class CrearReservaComponent implements OnInit, OnDestroy {
  private reservaService = inject(ReservasService);
  private clienteService = inject(ClientesService);
  private paqueteService = inject(PaquetesService);
  private excursionService = inject(ExcursionService);
  private alertas = inject(AlertService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  excursiones = signal<Excursion[]>([]);
  paquetes = signal<PaqueteComponent[]>([]); 
  cargando = signal<boolean>(false);
  idExcursion = input<number>();

  clientes = signal<Cliente[]>([]);
  clientesFiltrados = signal<Cliente[]>([]);
  mostrarResultados = signal(false);
  buscandoClientes = signal(false);

  reservaForm!: FormGroup;
  private formSubscription?: Subscription;
  
  ngOnInit(): void {
  this.cargando.set(true);

  // Inicializar formulario
  this.reservaForm = this.formBuilder.group({
    idExcursion: [null, [Validators.required, Validators.min(1)]],
    ciClientePagador: [null, [Validators.required, Validators.min(1)]],
    idPaquete: [null, [Validators.required, Validators.min(1)]]
  });

  // Cargar clientes
  this.clienteService.obtenerClientes().subscribe({
    next: (clientes) => {
      this.clientes.set(clientes);
    },
    error: (err) => {
      console.error('Error al cargar clientes:', err);
    }
  });

  // Cargar excursiones
  this.excursionService.obtenerExcursiones().subscribe({
    next: (response: any) => {
      this.excursiones.set(response);
      this.cargando.set(false);
    },
    error: () => this.cargando.set(false)
  });
}

  onSelectExcursion(idExcursion: number): void{
    this.cargarPaquetes(idExcursion);
    this.reservaForm.get("idExcursion")?.setValue(idExcursion);
  }

  cargarPaquetes(idExcursion: number): void {
    this.cargando.set(true);
    this.paqueteService.getPaquetesDeExcursion(idExcursion).subscribe({
      next: (response: any) => {
        this.paquetes.set(response);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar paquetes:', err);
        this.cargando.set(false);
      }
    });
  }

 
submitForm(): void {
  if (this.reservaForm.invalid) {
    this.reservaForm.markAllAsTouched();
    this.alertas.showAlert(
      'Debe completar todos los campos',
      'error',
      'Formulario inválido',
      5000
    );
    return;
  }

  this.cargando.set(true);

  const valores = this.reservaForm.getRawValue();
  const ciCliente = valores.ciClientePagador;

  // Verificar que exista el cliente
  this.clienteService.obtenerClientePorCi(ciCliente).subscribe({
    next: (clienteObtenido) => {
      if (!clienteObtenido) {
        this.alertas.showAlert(
          'No se encontró cliente con esa CI',
          'error',
          'C.I incorrecta',
          5000
        );
        this.cargando.set(false);
        return;
      }

      // Preparar los datos de la reserva
      const reserva: ReservaCrearModel = {
        CiClientePagador: valores.ciClientePagador,
        IdExcursion: valores.idExcursion,
        IdPaquete: valores.idPaquete
      };

      // Crear la reserva
      this.reservaService.postReserva(reserva).subscribe({
        next: (respuesta) => {
          // Descargar el PDF usando el ID devuelto por el backend
          this.reservaService.descargarPdf(respuesta.id).subscribe({
            next: (pdf: Blob) => {
  console.log('PDF recibido:', pdf.size, 'bytes', pdf.type);

  if (pdf.size === 0) {
    this.alertas.showAlert(
      'El PDF recibido está vacío',
      'error',
      'Error al generar comprobante',
      5000
    );
    this.cargando.set(false);
    return;
  }

  const url = URL.createObjectURL(pdf);
  const enlace = document.createElement('a');

  enlace.href = url;
  enlace.download = `Reserva_${respuesta.id}.pdf`;
  enlace.style.display = 'none';

  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();

  // Revocar la URL después de dar tiempo al navegador
  setTimeout(() => URL.revokeObjectURL(url), 1000);

  this.alertas.showAlert(
    'Reserva creada y comprobante descargado con éxito',
    'exito',
    'Éxito',
    3000
  );

  this.cargando.set(false);
  this.router.navigate(['/reservas']);
},
            error: (err) => {
              console.error('Error al descargar el PDF:', err);

              this.alertas.showAlert(
                'La reserva se creó, pero no se pudo descargar el PDF',
                'error',
                'Error al generar comprobante',
                5000
              );

              this.cargando.set(false);
              this.router.navigate(['/reservas']);
            }
          });
        },
        error: (err) => {
          console.error('Error al crear la reserva:', err);

          this.cargando.set(false);
          this.alertas.showAlert(
            'Hubo un problema al crear la reserva',
            'error',
            'Error',
            5000
          );
        }
      });
    },
    error: (err) => {
      console.error('Error al buscar el cliente:', err);

      this.cargando.set(false);
      this.alertas.showAlert(
        'Hubo un error al buscar el cliente',
        'error',
        'Error',
        5000
      );
    }
  });
}

  ngOnDestroy(): void {
    this.formSubscription?.unsubscribe();
  }

  volver(): void {
    this.router.navigate(['/reservas']);
  }
  onSeleccionPaquete(id:number){
        this.reservaForm.get('idPaquete')?.setValue(id);
  }

  buscarCliente(termino: string): void {
  const ci = termino.trim();

  if (!ci) {
    this.clientesFiltrados.set([]);
    this.mostrarResultados.set(false);
    this.reservaForm.get('ciClientePagador')?.setValue(null);
    return;
  }

  // Mientras escribe, no consideramos seleccionada una CI
  this.reservaForm.get('ciClientePagador')?.setValue(null);

  const resultados = this.clientes().filter(cliente =>
    cliente.ci.toString().includes(ci)
  );

  this.clientesFiltrados.set(resultados);
  this.mostrarResultados.set(true);
}

seleccionarCliente(cliente: Cliente): void {
  this.reservaForm.get('ciClientePagador')?.setValue(cliente.ci);
  this.mostrarResultados.set(false);
}

onClienteCreado(ci: number): void {
  this.clienteService.obtenerClientes().subscribe({
    next: (clientes) => {
      this.clientes.set(clientes);

      const nuevoCliente = clientes.find(c => c.ci === ci);

      if (nuevoCliente) {
        this.seleccionarCliente(nuevoCliente);
      }
    },
    error: (err) => {
      console.error('Error al actualizar clientes:', err);
    }
  });
}
}