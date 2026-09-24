import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonAgregarPaquete } from './boton-agregar-paquete';

describe('BotonAgregarPaquete', () => {
  let component: BotonAgregarPaquete;
  let fixture: ComponentFixture<BotonAgregarPaquete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotonAgregarPaquete],
    }).compileComponents();

    fixture = TestBed.createComponent(BotonAgregarPaquete);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
