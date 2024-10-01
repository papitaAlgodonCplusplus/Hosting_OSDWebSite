import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ClaimantClaimedOsdReportComponent } from './pages/claimant-claimed-osd-report/claimant-claimed-osd-report.component';
import { TransparencyComponent } from './pages/transparency/transparency.component';
import { TranslateModule } from '@ngx-translate/core';
import { OSDRevenueExpenditureEconomicResultReportComponent } from './pages/osd-revenue-expenditure-economic-result-report/osd-revenue-expenditure-economic-result-report.component';
import { PLRemunerationResultsReportComponent } from './pages/pl-remuneration-results-report/pl-remuneration-results-report.component';
import { CFHResultReportComponent } from './pages/cfhresult-report/cfhresult-report.component';
import { SharedModule } from '../shared/shared.module';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ClaimantClaimedOsdReportComponent,
    TransparencyComponent,
    OSDRevenueExpenditureEconomicResultReportComponent,
    PLRemunerationResultsReportComponent,
    CFHResultReportComponent
    ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    TranslateModule,
    SharedModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers:[
    DatePipe,
    {
      provide: MatPaginatorIntl
    }
  ]
})
export class ReportsModule { }
