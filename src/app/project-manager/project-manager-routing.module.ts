import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectManagementDossierComponent } from './pages/project-management-dossier/project-management-dossier.component';
import { CreateProjectComponent } from './pages/create-project/create-project.component';
import { AssignedPerformancesComponent } from './pages/assigned-performances/assigned-performances.component';
import { ResponseToPerformanceComponent } from './pages/response-to-performance/response-to-performance.component';
import { CreatePerformancesComponent } from './pages/create-performances/create-performances.component';
import { CreatePerformancesBuyComponent } from './pages/create-performances-buy/create-performances-buy.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectManagementDossierComponent
  },
  {
    path: 'create-project',
    component: CreateProjectComponent
  },
  {
    path: 'assigned-performance',
    component: AssignedPerformancesComponent
  },
  {
    path: 'response-to-performance',
    component: ResponseToPerformanceComponent
  },
  {
    path: 'create-performances',
    component: CreatePerformancesComponent
  },
  {
    path: 'create-performances-buy',
    component: CreatePerformancesBuyComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectManagerRoutingModule { }
