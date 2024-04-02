import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FunctionsRoutingModule } from './functions-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { AutorizationPlComponent } from './autorization-pl/autorization-pl.component';
import { CustomPaginator } from './service/custom-paginator';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { AssignPLTRClaimsComponent } from './assign-pltr-claims/assign-pltr-claims.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AutorizationPlComponent,
    AssignPLTRClaimsComponent,
    
    ],
  imports: [
    CommonModule,
    FunctionsRoutingModule,
    SharedModule,
    FormsModule,
    TranslateModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FunctionsModule { }
