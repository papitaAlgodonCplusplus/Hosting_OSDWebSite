import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransparencyComponent } from './transparency.component';

describe('TransparencyComponent', () => {
  let component: TransparencyComponent;
  let fixture: ComponentFixture<TransparencyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransparencyComponent]
    });
    fixture = TestBed.createComponent(TransparencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
