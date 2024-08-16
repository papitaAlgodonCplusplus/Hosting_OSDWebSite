import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryTypeModalComponent } from './summary-type-modal.component';

describe('SummaryTypeModalComponent', () => {
  let component: SummaryTypeModalComponent;
  let fixture: ComponentFixture<SummaryTypeModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SummaryTypeModalComponent]
    });
    fixture = TestBed.createComponent(SummaryTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
