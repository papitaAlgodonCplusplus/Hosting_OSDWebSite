import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignClientToTrainerComponent } from './assign-client-to-trainer.component';

describe('AssignClientToTrainerComponent', () => {
  let component: AssignClientToTrainerComponent;
  let fixture: ComponentFixture<AssignClientToTrainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignClientToTrainerComponent]
    });
    fixture = TestBed.createComponent(AssignClientToTrainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
