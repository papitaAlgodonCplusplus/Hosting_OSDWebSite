import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectManagementDossierComponent } from './pages/project-management-dossier/project-management-dossier.component';
import { PerformanceBuyComponent } from './pages/performance-buy/performance-buy.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectManagementDossierComponent
  },
  {
    path: 'performance-buy',
    component: PerformanceBuyComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectManagerRoutingModule { }
