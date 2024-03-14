import { TestBed } from '@angular/core/testing';

import { OSDDataService } from './osd-data.service';

describe('OSDDataService', () => {
  let service: OSDDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OSDDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
