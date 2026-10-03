import { Component, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { ReservasService } from '../../../services/reservas.service/reservas.service';
import { ClientesService } from '../../../services/clientes.service/clientes.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../services/alert.service/alert-service';
import { ReservaCrearModel } from '../../../models/reserva-crear.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SelectGenericoComponent } from '../../select-generico/select-generico';
import { PaqueteComponent } from '../../paquete/paquete';
import { Cliente } from '../../../models/cliente.model';
import { debounce, debounceTime, distinctUntilChanged, Observable, single, Subscription } from 'rxjs';
import { PaquetesService } from '../../../services/paquetes.service/paquetes.service';
import { Excursion } from '../../../models/excursion.model';
import { ExcursionService } from '../../../services/excursiones.service/excursion.service';

@Component({
  selector: 'app-crear-reserva',
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

  idExcursion = input<number>();

  excursiones = signal<Excursion[]>([]);

  paquetes = signal<PaqueteComponent[]>([]);

  cargando = signal<boolean>(false);

  reservaForm!: FormGroup;

  private formSubscription?: Subscription;
  
  ngOnInit(): void {
    this.excursionService.obtenerExcursiones().subscribe({
      next: (Response: any) => {
        this.excursiones.set(Response)
      } 
    })

    const valorIdExcursion = this.idExcursion();

    this.reservaForm = this.formBuilder.group({
      idExcursionForm: [
        { value : valorIdExcursion ? valorIdExcursion : 0,
          disabled : !!valorIdExcursion
        },
        [
          Validators.required, Validators.min(1)
        ]
      ],

      ciClientePagador: [
        0,
        [
          Validators.required, Validators.min(1)
        ]
      ],

      idPaquete: [
        0,
        [
          Validators.required, Validators.min(1)
        ]
      ]
    });

    if (valorIdExcursion && valorIdExcursion > 0) {
      this.cargarPaquetes(valorIdExcursion);
    };

    const controlExcursion = this.reservaForm.get('idExcursionForm');
    if (controlExcursion){
      this.formSubscription = controlExcursion.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged()
      ).subscribe((valorManual) => {
        console.log('1. Cambio detectado en el select. Valor:', valorManual);
        
        const idNumerico = Number(valorManual);
        
        if(idNumerico && idNumerico > 0){
          this.cargarPaquetes(idNumerico);
        }else {
          console.warn('2. El valor no es mayor a 0 o no es un número válido:', idNumerico);
        }
      })
    }

  }

  submitForm(): void {
    this.cargando.set(true);

    const valores = this.reservaForm.getRawValue();

    console.log(valores)

    if(this.reservaForm.invalid){
      this.reservaForm.markAllAsTouched();
      this.alertas.showAlert("Debe completar todos los campos", "error", "Formulario inválido", 5000);
      this.cargando.set(false);

      return
    };

    // Usamos getRawValue() para obtener todos los valores
  const ciCliente = valores.ciClientePagador;

  // 2. Buscamos el cliente (Nos suscribimos al Observable)
  this.clienteService.obtenerClientePorCi(ciCliente).subscribe({
    next: (clienteObtenido) => {
      
      // Si el backend devuelve null/undefined o vacío
      if (!clienteObtenido) {
        this.alertas.showAlert("No se encontró cliente con esa CI", "error", 'C.I incorrecta', 5000);
        this.cargando.set(false);
        return; 
      }

      // 3. SI EL CLIENTE EXISTE, armamos el objeto de la reserva
      // Fíjate que cambié valores.idExcursion por valores.idExcursionForm
      const reserva: ReservaCrearModel = {
        CiClientePagador: valores.ciClientePagador,
        IdExcursion: valores.idExcursionForm, 
        IdPaquete: valores.idPaquete
      };

      // 4. Guardamos la reserva (Segunda suscripción)
      this.reservaService.postReserva(reserva).subscribe({
        next: (Response: any) => {
          this.cargando.set(false);
          this.router.navigate(['/reservas']);
        },
        error: (err) => {
          this.cargando.set(false);
          this.alertas.showAlert("Hubo un problema al crear la reserva", "error", "Error", 5000);
        }
      });

    },
    error: (err) =>{this.cargando.set(false);}
  });
  }

  ngOnDestroy(): void {
    this.formSubscription?.unsubscribe();
  }

  cargarPaquetes(idExcursion: number){
    this.cargando.set(true);
    console.log('3. Llamando al servicio con ID:', idExcursion);

    this.reservaForm.get('idExcursionForm')?.setValue(idExcursion);

    this.paqueteService.getPaquetesDeExcursion(idExcursion).subscribe({
      next: (Response: any) => 
        { 
          console.log('4. Paquetes recibidos desde la API:', Response);
          this.paquetes.set(Response)
          this.cargando.set(false);
        },
        error: (err) => {
          console.error('ERROR al cargar los paquetes:', err);
          this.cargando.set(false);
        }
    })
  }

  onSeleccionPaquete(idPaquete: number){
    this.reservaForm.get('idPaquete')?.setValue(idPaquete);
  }
  volver(): void {
  this.router.navigate(['/reserva']);
}
}
