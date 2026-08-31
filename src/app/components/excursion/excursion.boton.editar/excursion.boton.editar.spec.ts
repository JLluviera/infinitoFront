import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcursionBotonEditar } from './excursion.boton.editar';

describe('ExcursionBotonEditar', () => {
  let component: ExcursionBotonEditar;
  let fixture: ComponentFixture<ExcursionBotonEditar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExcursionBotonEditar],
    }).compileComponents();

    fixture = TestBed.createComponent(ExcursionBotonEditar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
