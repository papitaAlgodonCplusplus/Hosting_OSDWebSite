import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchLanguagesComponent } from './switch-languages.component';

describe('SwitchLanguagesComponent', () => {
  let component: SwitchLanguagesComponent;
  let fixture: ComponentFixture<SwitchLanguagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SwitchLanguagesComponent]
    });
    fixture = TestBed.createComponent(SwitchLanguagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
