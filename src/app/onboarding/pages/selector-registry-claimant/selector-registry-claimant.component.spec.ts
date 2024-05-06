import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorRegistryClaimantComponent } from './selector-registry-claimant.component';

describe('SelectorRegistryClaimantComponent', () => {
  let component: SelectorRegistryClaimantComponent;
  let fixture: ComponentFixture<SelectorRegistryClaimantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectorRegistryClaimantComponent]
    });
    fixture = TestBed.createComponent(SelectorRegistryClaimantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
