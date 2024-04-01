import { TestBed } from '@angular/core/testing';

import { WebsocketServicePast } from './websocket.service';

describe('WebsocketService', () => {
  let service: WebsocketServicePast;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebsocketServicePast);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
