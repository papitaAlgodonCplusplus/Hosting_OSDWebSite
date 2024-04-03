import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './pages/home/home.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { FilesComponent } from './pages/files/files.component';
import { CourseFilesComponent } from './pages/course-files/course-files.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CreatePerformanceComponent } from './pages/create-performance/create-performance/create-performance.component';
import { FreeProfessionalFileComponent } from './pages/free-professional-file/free-professional-file.component';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { CustomPaginator } from '../functions/service/custom-paginator';



@NgModule({
  declarations: [
    HomeComponent,
    FilesComponent,
    CourseFilesComponent,
    CreatePerformanceComponent,
    FreeProfessionalFileComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    TranslateModule,
    MatPaginatorModule,
  ],
  providers: [
    {
      provide: MatPaginatorIntl,
      useFactory: (translateService: TranslateService) => {
        const customPaginator = new CustomPaginator(translateService);
        return customPaginator.getSpanishPaginatorIntl();
      },
      deps: [TranslateService]
    }
  ]
})
export class DashboardModule { }