import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimantClaimedOsdReportComponent } from './claimant-claimed-osd-report.component';

describe('ClaimantClaimedOsdReportComponent', () => {
  let component: ClaimantClaimedOsdReportComponent;
  let fixture: ComponentFixture<ClaimantClaimedOsdReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimantClaimedOsdReportComponent]
    });
    fixture = TestBed.createComponent(ClaimantClaimedOsdReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
