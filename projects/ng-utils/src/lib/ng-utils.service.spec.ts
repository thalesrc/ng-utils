import { TestBed } from '@angular/core/testing';

import { NgUtilsService } from './ng-utils.service';

describe('NgUtilsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgUtilsService = TestBed.get(NgUtilsService);
    expect(service).toBeTruthy();
  });
});
