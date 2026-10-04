import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantillaCreadorComponent } from './plantilla-creador.component';

describe('PlantillaCreadorComponent', () => {
  let component: PlantillaCreadorComponent;
  let fixture: ComponentFixture<PlantillaCreadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantillaCreadorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlantillaCreadorComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
