import { TestBed } from '@angular/core/testing';

import { AsignacionesAsientosService } from './asignaciones-asientos.service';

describe('AsignacionesAsientosService', () => {
  let service: AsignacionesAsientosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AsignacionesAsientosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
