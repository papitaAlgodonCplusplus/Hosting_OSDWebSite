import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsProcessorPerformanceComponent } from './claims-processor-performance.component';

describe('ClaimsProcessorPerformanceComponent', () => {
  let component: ClaimsProcessorPerformanceComponent;
  let fixture: ComponentFixture<ClaimsProcessorPerformanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimsProcessorPerformanceComponent]
    });
    fixture = TestBed.createComponent(ClaimsProcessorPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
