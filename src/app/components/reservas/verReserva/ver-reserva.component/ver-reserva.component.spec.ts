import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerReservaComponent } from './ver-reserva.component';

describe('VerReservaComponent', () => {
  let component: VerReservaComponent;
  let fixture: ComponentFixture<VerReservaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerReservaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VerReservaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
