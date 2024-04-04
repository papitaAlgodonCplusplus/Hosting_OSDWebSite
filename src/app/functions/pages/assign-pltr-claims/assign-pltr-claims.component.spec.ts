import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignPLTRClaimsComponent } from './assign-pltr-claims.component';

describe('AssignPLTRClaimsComponent', () => {
  let component: AssignPLTRClaimsComponent;
  let fixture: ComponentFixture<AssignPLTRClaimsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignPLTRClaimsComponent]
    });
    fixture = TestBed.createComponent(AssignPLTRClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
