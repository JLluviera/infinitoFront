import { TestBed } from '@angular/core/testing';

import { PlantillaVehiculoService } from './plantilla-vehiculo.service';

describe('PlantillaVehiculoService', () => {
  let service: PlantillaVehiculoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlantillaVehiculoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
