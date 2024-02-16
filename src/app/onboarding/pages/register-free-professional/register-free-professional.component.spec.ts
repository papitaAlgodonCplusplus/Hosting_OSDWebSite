import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterFreeProfessionalComponent } from './register-free-professional.component';

describe('RegisterFreeProfessionalComponent', () => {
  let component: RegisterFreeProfessionalComponent;
  let fixture: ComponentFixture<RegisterFreeProfessionalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterFreeProfessionalComponent]
    });
    fixture = TestBed.createComponent(RegisterFreeProfessionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
