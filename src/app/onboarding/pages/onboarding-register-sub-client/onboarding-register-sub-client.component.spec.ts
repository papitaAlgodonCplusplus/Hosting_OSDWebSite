import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingRegisterSubClientComponent } from './onboarding-register-sub-client.component';

describe('OnboardingRegisterSubClientComponent', () => {
  let component: OnboardingRegisterSubClientComponent;
  let fixture: ComponentFixture<OnboardingRegisterSubClientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OnboardingRegisterSubClientComponent]
    });
    fixture = TestBed.createComponent(OnboardingRegisterSubClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
