import { Component, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { ReservasService } from '../../../services/reservas.service/reservas.service';
import { ClientesService } from '../../../services/clientes.service/clientes.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../services/alert.service/alert-service';
import { ReservaCrearModel } from '../../../models/reserva-crear.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SelectGenericoComponent } from '../../select-generico/select-generico';
import { Paquete } from '../../paquete/paquete';
import { Cliente } from '../../../models/cliente.model';
import { debounce, debounceTime, distinctUntilChanged, Observable, Subscription } from 'rxjs';
import { PaquetesService } from '../../../services/paquetes.service';

@Component({
  selector: 'app-crear-reserva.component',
  imports: [CommonModule, ReactiveFormsModule, SelectGenericoComponent],
  templateUrl: './crear-reserva.component.html',
  styleUrl: './crear-reserva.component.css',
})
export class CrearReservaComponent implements OnInit, OnDestroy {
  private reservaService = inject(ReservasService);
  private clienteService = inject(ClientesService);
  private paqueteService = inject(PaquetesService);
  private alertas = inject(AlertService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  idExcursion = input<number>();

  paquetes = signal<Paquete[]>([]);

  reservaForm!: FormGroup;

  private formSubscription?: Subscription;
  
  ngOnInit(): void {
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
        if(valorManual && valorManual > 0 && controlExcursion.enable()){
          this.cargarPaquetes(valorManual);
        }
      })
    }

  }


  submitForm(): void {

    if(this.reservaForm.invalid){
      this.reservaForm.markAsTouched();
      this.alertas.showAlert("Debe completar todos los campos", "error", "Formulario inválido", 5000);

      return
    };

    const cliente: Observable<Cliente> = this.clienteService.obtenerClientePorId((this.reservaForm.get('ciClientePagador')?.value));

    if(!cliente){
      this.alertas.showAlert("No se encontró cliente con esa CI", "error", 'C.I incorrecta', 5000)
      return
    }

    const valores = this.reservaForm.getRawValue();


    const reserva: ReservaCrearModel = {
      IdClientePagador: valores.ciClientePagador,
      IdExcursion: valores.idExcursion,
      IdPaquete: valores.idPaquete
    }

    this.reservaService.postReserva(reserva).subscribe({
      next: (Response: any) => {
        this.router.navigate(['/reservas']);
      }
    })

  }

  ngOnDestroy(): void {
    this.formSubscription?.unsubscribe();
  }

  cargarPaquetes(idExcursion: number){
    this.paqueteService.getPaquetesDeExcursion(idExcursion).subscribe({
      next: (Response: any) => 
        { this.paquetes.set(Response)}
    })
  }
}
