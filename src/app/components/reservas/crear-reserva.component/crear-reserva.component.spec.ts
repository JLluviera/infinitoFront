import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearReservaComponent } from './crear-reserva.component';

describe('CrearReservaComponent', () => {
  let component: CrearReservaComponent;
  let fixture: ComponentFixture<CrearReservaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearReservaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CrearReservaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
