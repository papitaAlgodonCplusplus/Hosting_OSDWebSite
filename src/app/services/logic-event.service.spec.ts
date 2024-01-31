import { TestBed } from '@angular/core/testing';

import { LogicEventService } from './logic-event.service';

describe('LogicEventService', () => {
  let service: LogicEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogicEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
