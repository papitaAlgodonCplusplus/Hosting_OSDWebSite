import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AutorizationPlComponent } from './autorization-pl/autorization-pl.component';

const routes: Routes = [

  {
    path: 'autorization-pl',
    component: AutorizationPlComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FunctionsRoutingModule { }
