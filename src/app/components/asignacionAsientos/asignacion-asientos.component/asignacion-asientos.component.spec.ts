import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionAsientosComponent } from './asignacion-asientos.component';

describe('AsignacionAsientosComponent', () => {
  let component: AsignacionAsientosComponent;
  let fixture: ComponentFixture<AsignacionAsientosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignacionAsientosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AsignacionAsientosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
