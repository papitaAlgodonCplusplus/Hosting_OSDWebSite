import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeftSidebarTransparencyComponent } from './left-sidebar-transparency.component';

describe('LeftSidebarTransparencyComponent', () => {
  let component: LeftSidebarTransparencyComponent;
  let fixture: ComponentFixture<LeftSidebarTransparencyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeftSidebarTransparencyComponent]
    });
    fixture = TestBed.createComponent(LeftSidebarTransparencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
