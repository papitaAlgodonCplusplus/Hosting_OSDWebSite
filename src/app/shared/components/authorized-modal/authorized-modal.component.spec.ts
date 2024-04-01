import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizedModalComponent } from './authorized-modal.component';

describe('AuthorizedModalComponent', () => {
  let component: AuthorizedModalComponent;
  let fixture: ComponentFixture<AuthorizedModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthorizedModalComponent]
    });
    fixture = TestBed.createComponent(AuthorizedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
