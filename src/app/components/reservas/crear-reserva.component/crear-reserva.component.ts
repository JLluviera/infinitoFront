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

@Component({
  selector: 'app-crear-reserva',
  standalone: true,
  // SACAMOS el SelectGenericoComponent de los imports
  imports: [CommonModule, ReactiveFormsModule, SelectGenericoComponent], 
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

  reservaForm!: FormGroup;
  private formSubscription?: Subscription;
  
  ngOnInit(): void {
    this.cargando.set(true);

    // 1. Inicializar formulario limpio
    this.reservaForm = this.formBuilder.group({
      idExcursion: [null, [Validators.required, Validators.min(1)]],
      ciClientePagador: [null, [Validators.required, Validators.min(1)]],
      idPaquete: [null, [Validators.required, Validators.min(1)]]
    });

    // 2. Traer las excursiones disponibles (una sola vez)
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
    if(this.reservaForm.invalid){
      this.reservaForm.markAllAsTouched();
      this.alertas.showAlert("Debe completar todos los campos", "error", "Formulario inválido", 5000);
      return;
    }

    this.cargando.set(true);
    const valores = this.reservaForm.getRawValue();
    const ciCliente = valores.ciClientePagador;

    // Verificar cliente
    this.clienteService.obtenerClientePorCi(ciCliente).subscribe({
      next: (clienteObtenido) => {
        if (!clienteObtenido) {
          this.alertas.showAlert("No se encontró cliente con esa CI", "error", 'C.I incorrecta', 5000);
          this.cargando.set(false);
          return; 
        }

        // Crear la reserva
        const reserva: ReservaCrearModel = {
          CiClientePagador: valores.ciClientePagador,
          IdExcursion: valores.idExcursion, 
          IdPaquete: valores.idPaquete
        };

        this.reservaService.postReserva(reserva).subscribe({
          next: () => {
            this.cargando.set(false);
            this.alertas.showAlert("Reserva creada con éxito", "exito", "Éxito", 3000);
            this.router.navigate(['/reservas']);
          },
          error: () => {
            this.cargando.set(false);
            this.alertas.showAlert("Hubo un problema al crear la reserva", "error", "Error", 5000);
          }
        });

      },
      error: () => {
        this.cargando.set(false);
        this.alertas.showAlert("Hubo un error al buscar el cliente", "error", "Error", 5000);
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
}