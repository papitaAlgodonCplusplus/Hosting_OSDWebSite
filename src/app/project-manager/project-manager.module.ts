import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ProjectManagerRoutingModule } from './project-manager-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProjectManagementDossierComponent } from './pages/project-management-dossier/project-management-dossier.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerformanceBuyComponent } from './pages/performance-buy/performance-buy.component';
import { PerformanceFreeProfessionalComponent } from './pages/performance-free-professional/performance-free-professional.component';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { CustomPaginator } from '../services/custom-paginator.service';
import { CreateProjectComponent } from './pages/create-project/create-project.component';
import { SummaryTypeModalComponent } from './shared/summary-type-modal/summary-type-modal.component';
import { AssignedPerformancesComponent } from './pages/assigned-performances/assigned-performances.component';

@NgModule({
  declarations: [
    ProjectManagementDossierComponent,
    PerformanceBuyComponent,
    PerformanceFreeProfessionalComponent,
    CreateProjectComponent,
    SummaryTypeModalComponent,
    AssignedPerformancesComponent,
  ],
  imports: [
    CommonModule,
    ProjectManagerRoutingModule,
    SharedModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule
  ],
  providers: [
    DatePipe,
    {
      provide: MatPaginatorIntl,
      useFactory: (translateService: TranslateService) => {
        const customPaginator = new CustomPaginator(translateService);
        return customPaginator.getSpanishPaginatorIntl();
      },
      deps: [TranslateService]
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class ProjectManagerModule { }
