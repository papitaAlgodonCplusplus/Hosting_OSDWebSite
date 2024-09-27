import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePerformancesBuyComponent } from './create-performances-buy.component';

describe('CreatePerformancesBuyComponent', () => {
  let component: CreatePerformancesBuyComponent;
  let fixture: ComponentFixture<CreatePerformancesBuyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatePerformancesBuyComponent]
    });
    fixture = TestBed.createComponent(CreatePerformancesBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
