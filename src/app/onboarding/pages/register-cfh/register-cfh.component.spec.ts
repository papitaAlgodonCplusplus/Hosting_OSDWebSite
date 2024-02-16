import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCfhComponent } from './register-cfh.component';

describe('RegisterCfhComponent', () => {
  let component: RegisterCfhComponent;
  let fixture: ComponentFixture<RegisterCfhComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterCfhComponent]
    });
    fixture = TestBed.createComponent(RegisterCfhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
