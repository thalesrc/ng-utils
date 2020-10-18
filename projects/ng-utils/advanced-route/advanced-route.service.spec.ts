import { TestBed } from '@angular/core/testing';

import { AdvancedRouteService } from './advanced-route.service';

describe('AdvancedRouteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdvancedRouteService = TestBed.get(AdvancedRouteService);
    expect(service).toBeTruthy();
  });
});
