import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonAgregarTransaccionComponent } from './boton-agregar-transaccion';

describe('BotonAgregarTransaccion', () => {
  let component: BotonAgregarTransaccionComponent;
  let fixture: ComponentFixture<BotonAgregarTransaccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotonAgregarTransaccionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BotonAgregarTransaccionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
