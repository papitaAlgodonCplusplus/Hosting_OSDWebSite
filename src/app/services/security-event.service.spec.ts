import { TestBed } from '@angular/core/testing';

import { SecurityEventService } from './security-event.service';

describe('SecurityEventService', () => {
  let service: SecurityEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecurityEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
