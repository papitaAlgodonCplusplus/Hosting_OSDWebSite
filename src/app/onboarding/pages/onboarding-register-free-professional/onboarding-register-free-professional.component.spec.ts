import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingRegisterFreeProfessionalComponent } from './onboarding-register-free-professional.component';

describe('OnboardingRegisterFreeProfessionalComponent', () => {
  let component: OnboardingRegisterFreeProfessionalComponent;
  let fixture: ComponentFixture<OnboardingRegisterFreeProfessionalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OnboardingRegisterFreeProfessionalComponent]
    });
    fixture = TestBed.createComponent(OnboardingRegisterFreeProfessionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
