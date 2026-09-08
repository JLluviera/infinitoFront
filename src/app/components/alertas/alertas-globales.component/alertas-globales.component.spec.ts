import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertasGlobalesComponent } from './alertas-globales.component';

describe('AlertasGlobalesComponent', () => {
  let component: AlertasGlobalesComponent;
  let fixture: ComponentFixture<AlertasGlobalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertasGlobalesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertasGlobalesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
