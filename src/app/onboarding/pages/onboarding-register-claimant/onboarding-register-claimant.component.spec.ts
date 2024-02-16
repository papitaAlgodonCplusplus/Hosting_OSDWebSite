import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingRegisterClaimantComponent } from './onboarding-register-claimant.component';

describe('OnboardingRegisterClaimantComponent', () => {
  let component: OnboardingRegisterClaimantComponent;
  let fixture: ComponentFixture<OnboardingRegisterClaimantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OnboardingRegisterClaimantComponent]
    });
    fixture = TestBed.createComponent(OnboardingRegisterClaimantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
