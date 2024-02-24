import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingRegisterCfhComponent } from './onboarding-register-cfh.component';

describe('OnboardingRegisterCfhComponent', () => {
  let component: OnboardingRegisterCfhComponent;
  let fixture: ComponentFixture<OnboardingRegisterCfhComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OnboardingRegisterCfhComponent]
    });
    fixture = TestBed.createComponent(OnboardingRegisterCfhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
