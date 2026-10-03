import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonEditarPaquete } from './boton-editar-paquete';

describe('BotonEditarPaquete', () => {
  let component: BotonEditarPaquete;
  let fixture: ComponentFixture<BotonEditarPaquete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotonEditarPaquete],
    }).compileComponents();

    fixture = TestBed.createComponent(BotonEditarPaquete);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
