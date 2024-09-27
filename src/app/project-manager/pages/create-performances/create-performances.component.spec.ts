import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePerformancesComponent } from './create-performances.component';

describe('CreatePerformancesComponent', () => {
  let component: CreatePerformancesComponent;
  let fixture: ComponentFixture<CreatePerformancesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatePerformancesComponent]
    });
    fixture = TestBed.createComponent(CreatePerformancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
