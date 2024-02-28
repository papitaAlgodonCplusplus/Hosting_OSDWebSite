import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransparencyComponent } from './pages/transparency/transparency.component';

const routes: Routes = [

  {
    path: '',
    component: TransparencyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
