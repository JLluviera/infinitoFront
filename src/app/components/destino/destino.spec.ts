import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinoComponent } from '../destino/destino';

describe('Destino', () => {
  let component: DestinoComponent;
  let fixture: ComponentFixture<DestinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DestinoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DestinoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
