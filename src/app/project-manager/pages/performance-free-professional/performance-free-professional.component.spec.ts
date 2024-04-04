import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceFreeProfessionalComponent } from './performance-free-professional.component';

describe('PerformanceFreeProfessionalComponent', () => {
  let component: PerformanceFreeProfessionalComponent;
  let fixture: ComponentFixture<PerformanceFreeProfessionalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PerformanceFreeProfessionalComponent]
    });
    fixture = TestBed.createComponent(PerformanceFreeProfessionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
