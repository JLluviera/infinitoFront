import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaisBotonEditar } from './pais.boton.editar';

describe('PaisBotonEditar', () => {
  let component: PaisBotonEditar;
  let fixture: ComponentFixture<PaisBotonEditar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaisBotonEditar],
    }).compileComponents();

    fixture = TestBed.createComponent(PaisBotonEditar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
