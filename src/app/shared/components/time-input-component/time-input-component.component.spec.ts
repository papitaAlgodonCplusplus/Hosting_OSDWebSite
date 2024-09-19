import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeInputComponentComponent } from './time-input-component.component';

describe('TimeInputComponentComponent', () => {
  let component: TimeInputComponentComponent;
  let fixture: ComponentFixture<TimeInputComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimeInputComponentComponent]
    });
    fixture = TestBed.createComponent(TimeInputComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
