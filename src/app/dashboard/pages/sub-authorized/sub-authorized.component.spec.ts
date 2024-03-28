import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAuthorizedComponent } from './sub-authorized.component';

describe('SubAuthorizedComponent', () => {
  let component: SubAuthorizedComponent;
  let fixture: ComponentFixture<SubAuthorizedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubAuthorizedComponent]
    });
    fixture = TestBed.createComponent(SubAuthorizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
