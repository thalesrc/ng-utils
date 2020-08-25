import { TestBed } from '@angular/core/testing';

import { SubstituteService } from './substitute.service';

describe('SubstituteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubstituteService = TestBed.get(SubstituteService);
    expect(service).toBeTruthy();
  });
});
