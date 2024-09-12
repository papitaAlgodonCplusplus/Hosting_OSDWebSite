import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsTrainerPerformanceComponent } from './claims-trainer-performance.component';

describe('ClaimsTrainerPerformanceComponent', () => {
  let component: ClaimsTrainerPerformanceComponent;
  let fixture: ComponentFixture<ClaimsTrainerPerformanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimsTrainerPerformanceComponent]
    });
    fixture = TestBed.createComponent(ClaimsTrainerPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
