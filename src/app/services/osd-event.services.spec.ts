import { TestBed } from '@angular/core/testing';
import { OSDService } from './osd-event.services';

describe('OSDService', () => {
  let service: OSDService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OSDService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
