import { TestBed } from '@angular/core/testing';

import { LogicDataService } from './logic-data.service';

describe('LogicDataService', () => {
  let service: LogicDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogicDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
