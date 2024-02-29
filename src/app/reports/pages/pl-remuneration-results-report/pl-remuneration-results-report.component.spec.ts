import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PLRemunerationResultsReportComponent } from './pl-remuneration-results-report.component';

describe('PLRemunerationResultsReportComponent', () => {
  let component: PLRemunerationResultsReportComponent;
  let fixture: ComponentFixture<PLRemunerationResultsReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PLRemunerationResultsReportComponent]
    });
    fixture = TestBed.createComponent(PLRemunerationResultsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
