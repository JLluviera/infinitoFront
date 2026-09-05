import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteBotonAgregar } from './cliente.boton.agregar';

describe('ClienteBotonAgregar', () => {
  let component: ClienteBotonAgregar;
  let fixture: ComponentFixture<ClienteBotonAgregar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteBotonAgregar],
    }).compileComponents();

    fixture = TestBed.createComponent(ClienteBotonAgregar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
