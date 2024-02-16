import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterSubClientComponent } from './register-sub-client.component';

describe('RegisterSubClientComponent', () => {
  let component: RegisterSubClientComponent;
  let fixture: ComponentFixture<RegisterSubClientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterSubClientComponent]
    });
    fixture = TestBed.createComponent(RegisterSubClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
