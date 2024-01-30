import { TestBed } from '@angular/core/testing';

import { SecurityDataService } from './security-data.service';

describe('SecurityDataService', () => {
  let service: SecurityDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecurityDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
