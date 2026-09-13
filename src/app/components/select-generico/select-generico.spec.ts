import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectGenerico } from './select-generico';

describe('SelectGenerico', () => {
  let component: SelectGenerico;
  let fixture: ComponentFixture<SelectGenerico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectGenerico],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectGenerico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
