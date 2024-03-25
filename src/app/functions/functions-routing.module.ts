import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AutorizationPlComponent } from './autorization-pl/autorization-pl.component';
import { AssignPLTRClaimsComponent } from './assign-pltr-claims/assign-pltr-claims.component';

const routes: Routes = [

  {
    path: 'autorization-pl',
    component: AutorizationPlComponent
  },
  {
    path: 'assign-pltr-claims',
    component: AssignPLTRClaimsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FunctionsRoutingModule { }
