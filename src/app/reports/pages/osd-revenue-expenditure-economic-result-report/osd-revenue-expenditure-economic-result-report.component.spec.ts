import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OSDRevenueExpenditureEconomicResultReportComponent } from './osd-revenue-expenditure-economic-result-report.component';

describe('OSDRevenueExpenditureEconomicResultReportComponent', () => {
  let component: OSDRevenueExpenditureEconomicResultReportComponent;
  let fixture: ComponentFixture<OSDRevenueExpenditureEconomicResultReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OSDRevenueExpenditureEconomicResultReportComponent]
    });
    fixture = TestBed.createComponent(OSDRevenueExpenditureEconomicResultReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
