import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputNewpasswordComponent } from './input-newpassword.component';

describe('InputNewpasswordComponent', () => {
  let component: InputNewpasswordComponent;
  let fixture: ComponentFixture<InputNewpasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputNewpasswordComponent]
    });
    fixture = TestBed.createComponent(InputNewpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
