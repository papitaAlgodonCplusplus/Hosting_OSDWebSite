import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProceedingCourseComponent } from './proceeding-course.component';

describe('ProceedingCourseComponent', () => {
  let component: ProceedingCourseComponent;
  let fixture: ComponentFixture<ProceedingCourseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProceedingCourseComponent]
    });
    fixture = TestBed.createComponent(ProceedingCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
