import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsPerformanceComponent } from './claims-performance.component';

describe('ClaimsPerformanceComponent', () => {
  let component: ClaimsPerformanceComponent;
  let fixture: ComponentFixture<ClaimsPerformanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimsPerformanceComponent]
    });
    fixture = TestBed.createComponent(ClaimsPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
