import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseToPerformanceComponent } from './response-to-performance.component';

describe('ResponseToPerformanceComponent', () => {
  let component: ResponseToPerformanceComponent;
  let fixture: ComponentFixture<ResponseToPerformanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResponseToPerformanceComponent]
    });
    fixture = TestBed.createComponent(ResponseToPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
