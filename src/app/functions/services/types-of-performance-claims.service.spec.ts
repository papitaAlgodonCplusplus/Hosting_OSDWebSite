import { TestBed } from '@angular/core/testing';

import { TypesOfPerformanceClaimsService } from './types-of-performance-claims.service';

describe('TypesOfPerformanceClaimsService', () => {
  let service: TypesOfPerformanceClaimsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypesOfPerformanceClaimsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
