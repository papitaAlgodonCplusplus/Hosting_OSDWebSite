import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsFileComponent } from './claims-file.component';

describe('ClaimsFileComponent', () => {
  let component: ClaimsFileComponent;
  let fixture: ComponentFixture<ClaimsFileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimsFileComponent]
    });
    fixture = TestBed.createComponent(ClaimsFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
