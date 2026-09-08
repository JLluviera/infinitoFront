import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerExcursionComponent } from './ver-excursion.component';

describe('VerExcursionComponent', () => {
  let component: VerExcursionComponent;
  let fixture: ComponentFixture<VerExcursionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerExcursionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VerExcursionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
