import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './pages/home/home.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { FilesComponent } from './pages/files/files.component';
import { CourseFilesComponent } from './pages/course-files/course-files.component';
import { TranslateModule } from '@ngx-translate/core';
import { CreatePerformanceComponent } from './pages/create-performance/create-performance/create-performance.component';


@NgModule({
  declarations: [
    HomeComponent,
    FilesComponent,
    CourseFilesComponent,
    CreatePerformanceComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    TranslateModule
  ]
})
export class DashboardModule { }