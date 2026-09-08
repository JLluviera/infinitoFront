import { TestBed } from '@angular/core/testing';
import { ExcursionService } from './excursion.service';

describe('ExcursionService', () => {

  let service: ExcursionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExcursionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});