import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectManagementDossierComponent } from './pages/project-management-dossier/project-management-dossier.component';
import { PerformanceBuyComponent } from './pages/performance-buy/performance-buy.component';
import { PerformanceFreeProfessionalComponent } from './pages/performance-free-professional/performance-free-professional.component';
import { CreateProjectComponent } from './pages/create-project/create-project.component';
import { AssignedPerformancesComponent } from './pages/assigned-performances/assigned-performances.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectManagementDossierComponent
  },
  {
    path: 'performance-buy',
    component: PerformanceBuyComponent
  },
  {
    path: 'performance-free-professional',
    component: PerformanceFreeProfessionalComponent
  },
  {
    path: 'create-project',
    component: CreateProjectComponent
  },
  {
    path: 'assigned-performance',
    component: AssignedPerformancesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectManagerRoutingModule { }
