import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcursionBotonAgregarComponent } from './excursion.boton.agregar.component';

describe('ExcursionBotonAgregarComponent', () => {
  let component: ExcursionBotonAgregarComponent;
  let fixture: ComponentFixture<ExcursionBotonAgregarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExcursionBotonAgregarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExcursionBotonAgregarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
