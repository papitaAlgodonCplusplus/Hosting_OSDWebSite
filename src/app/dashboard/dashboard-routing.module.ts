import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FilesComponent } from './pages/files/files.component';
import { CreatePerformanceComponent } from './pages/create-performance/create-performance/create-performance.component';
import { CourseFilesComponent } from './pages/course-files/course-files.component';
import { SaleComponent } from './pages/sale/sale.component';
import { FreeProfessionalFileComponent } from './pages/free-professional-file/free-professional-file.component';
import { SubAuthorizedComponent } from './pages/sub-authorized/sub-authorized.component';

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
    path: 'performance',
    component: CreatePerformanceComponent
  },
  {
    path: 'course-files',
    component: CourseFilesComponent
  },
  {
    path: 'sale',
    component: SaleComponent
  },
  {
    path: 'sub-authorized',
    component: SubAuthorizedComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
