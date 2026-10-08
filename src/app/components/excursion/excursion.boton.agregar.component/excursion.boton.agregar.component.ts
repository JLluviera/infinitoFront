import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CrearExcursion } from '../../../models/excursion.model';
import { ExcursionService } from '../../../services/excursiones.service/excursion.service';
import { Destino } from '../../../models/destino.model';
import { DestinoService } from '../../../services/destinos.service/destino.service';
import { SelectGenericoComponent } from '../../select-generico/select-generico';
import { PlantillaVehiculo } from '../../../models/plantillaVehiculo.model';
import { PlantillaVehiculoService } from '../../../services/plantillaVehiculo.service/plantilla-vehiculo.service';
import { AlertService } from '../../../services/alert.service/alert-service';

@Component({
  selector: 'app-excursion-boton-agregar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,SelectGenericoComponent],
  templateUrl: './excursion.boton.agregar.component.html'
})

export class ExcursionBotonAgregarComponent {

  private excursionService = inject(ExcursionService);
  private destinoService = inject(DestinoService);
  private plantillasService = inject(PlantillaVehiculoService);
  private alert = inject(AlertService);

  destinos: Destino[] = [];
  plantillas = signal<PlantillaVehiculo[] | null>(null);

  constructor() {
    this.obtenerDestinos();
    this.obtenerPlantillas();
  }
  private fb = inject(FormBuilder);

  obtenerDestinos(): void {
    this.destinoService.obtenerDestinos().subscribe({
      next: (destinos) => {
        this.destinos = destinos;
      },
      error: (error) => {
        console.error('❌ Error al obtener destinos:', error);
      }
    });
  }
  
  obtenerPlantillas(): void {
    this.plantillasService.getPlantillas().subscribe({
      next: (resp: PlantillaVehiculo[]) =>{
        this.plantillas.set(resp);
      }
    })
  }

  @Output() excursionCreada = new EventEmitter<void>();


  isOpen = signal<boolean>(false);


  excursionForm: FormGroup = this.fb.group({

    nombre: [
      '',
      [
        Validators.required,
        Validators.minLength(2)
      ]
    ],

    fechaSalida: [
      '',
      Validators.required
    ],

    cantDias: [
      1,
      [
        Validators.required,
        Validators.min(1)
      ]
    ],

    cantLugares: [
      1,
      [
        Validators.required,
        Validators.min(1)
      ]
    ],

    destinoId: [
      0,
      [
        Validators.required,
        Validators.min(1)
      ]
    ],

    plantillaId: [
      0,
      [
        Validators.required,
        Validators.min(1)
      ]
    ]

  });

  abrirModal(): void {

    this.isOpen.set(true);

  }

  cerrarModal(): void {

    this.isOpen.set(false);

    this.excursionForm.reset({
      cantDias: 1,
      cantLugares: 1,
      destinoId: 0,
      plantillaId: 0
    });

  }


  submitForm(): void {

    if (this.excursionForm.invalid) {

      this.excursionForm.markAllAsTouched();

      return;

    }


    const excursion: CrearExcursion = {

      nombre: this.excursionForm.get('nombre')?.value,

      fechaSalida: this.excursionForm.get('fechaSalida')?.value,

      cantDias: this.excursionForm.get('cantDias')?.value,

      cantLugares: this.excursionForm.get('cantLugares')?.value,

      destinoId: this.excursionForm.get('destinoId')?.value,

      plantillaVehiculoId: this.excursionForm.get('plantillaId')?.value

    };


    this.excursionService.crearExcursion(excursion).subscribe({

      next: (response: any) => {

        this.alert.showAlert("Excursion creada", "exito", "Procedimiento exitoso", 3000);

        this.cerrarModal();

        this.excursionCreada.emit();

      },

      error: (error: any) => {

        console.error(
          'Error al crear excursión:',
          error
        );
      }
    });
  }

  onSeleccionPlanilla(idPlanilla: number){
    this.excursionForm.get('plantillaId')?.setValue(idPlanilla);
  }

  onSeleccionDestino(idDestino: number){
    this.excursionForm.get('destinoId')?.setValue(idDestino);
  }
}