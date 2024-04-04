import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceBuyComponent } from './performance-buy.component';

describe('PerformanceBuyComponent', () => {
  let component: PerformanceBuyComponent;
  let fixture: ComponentFixture<PerformanceBuyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PerformanceBuyComponent]
    });
    fixture = TestBed.createComponent(PerformanceBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
