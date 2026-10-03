import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonEditarTransaccion } from './boton-editar-transaccion';

describe('BotonEditarTransaccion', () => {
  let component: BotonEditarTransaccion;
  let fixture: ComponentFixture<BotonEditarTransaccion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotonEditarTransaccion],
    }).compileComponents();

    fixture = TestBed.createComponent(BotonEditarTransaccion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
