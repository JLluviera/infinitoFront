import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinoFormulario } from './destino-formulario';

describe('DestinoFormulario', () => {
  let component: DestinoFormulario;
  let fixture: ComponentFixture<DestinoFormulario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DestinoFormulario],
    }).compileComponents();

    fixture = TestBed.createComponent(DestinoFormulario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
