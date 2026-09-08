import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteBotonEditar } from './cliente.boton.editar';

describe('ClienteBotonEditar', () => {
  let component: ClienteBotonEditar;
  let fixture: ComponentFixture<ClienteBotonEditar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteBotonEditar],
    }).compileComponents();

    fixture = TestBed.createComponent(ClienteBotonEditar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
