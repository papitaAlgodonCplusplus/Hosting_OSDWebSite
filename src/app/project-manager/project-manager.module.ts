import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectManagerRoutingModule } from './project-manager-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectManagementDossierComponent } from './pages/project-management-dossier/project-management-dossier.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerformanceBuyComponent } from './pages/performance-buy/performance-buy.component';
import { PerformanceFreeProfessionalComponent } from './pages/performance-free-professional/performance-free-professional.component';


@NgModule({
  declarations: [
    ProjectManagementDossierComponent,
    PerformanceBuyComponent,
    PerformanceFreeProfessionalComponent,
  ],
  imports: [
    CommonModule,
    ProjectManagerRoutingModule,
    SharedModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ProjectManagerModule { }
