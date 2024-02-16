import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FilesComponent } from './pages/files/files.component';

// Child routes of the dashboard model
const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'files',
    component: FilesComponent
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
