import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingRegisterTypeComponent } from './onboarding-register-type.component';

describe('OnboardingRegisterTypeComponent', () => {
  let component: OnboardingRegisterTypeComponent;
  let fixture: ComponentFixture<OnboardingRegisterTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OnboardingRegisterTypeComponent]
    });
    fixture = TestBed.createComponent(OnboardingRegisterTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
