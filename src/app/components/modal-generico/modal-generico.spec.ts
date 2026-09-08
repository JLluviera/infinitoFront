import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGenerico } from './modal-generico';

describe('ModalGenerico', () => {
  let component: ModalGenerico;
  let fixture: ComponentFixture<ModalGenerico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalGenerico],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalGenerico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
