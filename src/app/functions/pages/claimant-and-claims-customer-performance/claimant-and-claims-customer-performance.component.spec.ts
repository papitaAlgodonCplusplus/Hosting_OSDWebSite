import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimantAndClaimsCustomerPerformanceComponent } from './claimant-and-claims-customer-performance.component';

describe('ClaimantAndClaimsCustomerPerformanceComponent', () => {
  let component: ClaimantAndClaimsCustomerPerformanceComponent;
  let fixture: ComponentFixture<ClaimantAndClaimsCustomerPerformanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimantAndClaimsCustomerPerformanceComponent]
    });
    fixture = TestBed.createComponent(ClaimantAndClaimsCustomerPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
