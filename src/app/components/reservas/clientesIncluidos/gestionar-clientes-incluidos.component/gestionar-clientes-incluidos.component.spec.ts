import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarClientesIncluidosComponent } from './gestionar-clientes-incluidos.component';

describe('GestionarClientesIncluidosComponent', () => {
  let component: GestionarClientesIncluidosComponent;
  let fixture: ComponentFixture<GestionarClientesIncluidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarClientesIncluidosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionarClientesIncluidosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
