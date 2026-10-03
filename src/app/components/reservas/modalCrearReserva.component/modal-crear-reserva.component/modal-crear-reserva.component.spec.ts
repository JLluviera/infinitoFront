import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCrearReservaComponent } from './modal-crear-reserva.component';

describe('ModalCrearReservaComponent', () => {
  let component: ModalCrearReservaComponent;
  let fixture: ComponentFixture<ModalCrearReservaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCrearReservaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalCrearReservaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
