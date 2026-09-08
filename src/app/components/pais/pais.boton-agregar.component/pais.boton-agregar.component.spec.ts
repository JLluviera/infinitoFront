import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaisBotonAgregarComponent } from './pais.boton-agregar.component';

describe('PaisBotonAgregarComponent', () => {
  let component: PaisBotonAgregarComponent;
  let fixture: ComponentFixture<PaisBotonAgregarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaisBotonAgregarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaisBotonAgregarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
