import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeProfessionalFileComponent } from './free-professional-file.component';

describe('FreeProfessionalFileComponent', () => {
  let component: FreeProfessionalFileComponent;
  let fixture: ComponentFixture<FreeProfessionalFileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FreeProfessionalFileComponent]
    });
    fixture = TestBed.createComponent(FreeProfessionalFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
