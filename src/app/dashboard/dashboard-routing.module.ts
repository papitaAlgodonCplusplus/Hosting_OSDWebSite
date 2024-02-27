import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FilesComponent } from './pages/files/files.component';
import { CourseFilesComponent } from './pages/course-files/course-files.component';
import { SaleComponent } from './pages/sale/sale.component';

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
  {
    path: 'course-files',
    component: CourseFilesComponent
  },
  {
    path: 'sale',
    component: SaleComponent
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
