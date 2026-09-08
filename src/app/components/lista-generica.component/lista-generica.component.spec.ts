import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaGenericaComponent } from './lista-generica.component';

describe('ListaGenericaComponent', () => {
  let component: ListaGenericaComponent;
  let fixture: ComponentFixture<ListaGenericaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaGenericaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaGenericaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
