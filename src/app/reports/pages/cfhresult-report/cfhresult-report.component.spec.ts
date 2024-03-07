import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CFHResultReportComponent } from './cfhresult-report.component';

describe('CFHResultReportComponent', () => {
  let component: CFHResultReportComponent;
  let fixture: ComponentFixture<CFHResultReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CFHResultReportComponent]
    });
    fixture = TestBed.createComponent(CFHResultReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
