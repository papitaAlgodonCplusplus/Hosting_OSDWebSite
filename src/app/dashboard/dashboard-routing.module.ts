import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CourseFilesComponent } from './pages/course-files/course-files.component';

// Child routes of the dashboard model
const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'course-files',
    component: CourseFilesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
