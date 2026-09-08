import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcursionComponent } from '../excursion/excursion';

describe('Excursion', () => {
  let component: ExcursionComponent;
  let fixture: ComponentFixture<ExcursionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExcursionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExcursionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
