import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectManagementDossierComponent } from './project-management-dossier.component';

describe('ProjectManagementDossierComponent', () => {
  let component: ProjectManagementDossierComponent;
  let fixture: ComponentFixture<ProjectManagementDossierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectManagementDossierComponent]
    });
    fixture = TestBed.createComponent(ProjectManagementDossierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
