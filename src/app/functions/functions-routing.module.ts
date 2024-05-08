import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AutorizationPlComponent } from './pages/autorization-pl/autorization-pl.component';
import { AssignPLTRClaimsComponent } from './pages/assign-pltr-claims/assign-pltr-claims.component';
import { SubAuthorizedComponent } from './pages/sub-authorized/sub-authorized.component';
import { ClaimsFileComponent } from './pages/claims-file/claims-file.component';
import { FileManagerComponent } from './pages/file-manager/file-manager.component';
import { ClaimsPerformanceComponent } from './pages/claims-performance/claims-performance.component';

const routes: Routes = [
  {
    path: 'autorization-pl',
    component: AutorizationPlComponent
  },
  {
    path: 'assign-pltr-claims',
    component: AssignPLTRClaimsComponent
  },
  {
    path: 'sub-authorized',
    component: SubAuthorizedComponent
  },
  {
    path: 'claims-file',
    component: ClaimsFileComponent
  },
  {
    path: 'file-manager',
    component: FileManagerComponent
  },
  {
    path: 'claims-performance',
    component: ClaimsPerformanceComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FunctionsRoutingModule { }
