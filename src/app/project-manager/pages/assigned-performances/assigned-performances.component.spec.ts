import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedPerformancesComponent } from './assigned-performances.component';

describe('AssignedPerformancesComponent', () => {
  let component: AssignedPerformancesComponent;
  let fixture: ComponentFixture<AssignedPerformancesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignedPerformancesComponent]
    });
    fixture = TestBed.createComponent(AssignedPerformancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
