import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcursionBotonEditarComponent } from './excursion.boton.editar';

describe('ExcursionBotonEditar', () => {
  let component: ExcursionBotonEditarComponent;
  let fixture: ComponentFixture<ExcursionBotonEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExcursionBotonEditarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExcursionBotonEditarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
