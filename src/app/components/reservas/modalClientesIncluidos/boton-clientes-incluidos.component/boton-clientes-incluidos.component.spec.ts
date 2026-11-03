import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonClientesIncluidosComponent } from './boton-clientes-incluidos.component';

describe('BotonClientesIncluidosComponent', () => {
  let component: BotonClientesIncluidosComponent;
  let fixture: ComponentFixture<BotonClientesIncluidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotonClientesIncluidosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BotonClientesIncluidosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
