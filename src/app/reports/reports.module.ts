import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ClaimantClaimedOsdReportComponent } from './pages/claimant-claimed-osd-report/claimant-claimed-osd-report.component';
import { TransparencyComponent } from './pages/transparency/transparency.component';
import { TranslateModule } from '@ngx-translate/core';
import { LeftSidebarTransparencyComponent } from './components/left-sidebar-transparency/left-sidebar-transparency.component';
import { OSDRevenueExpenditureEconomicResultReportComponent } from './pages/osd-revenue-expenditure-economic-result-report/osd-revenue-expenditure-economic-result-report.component';
import { PLRemunerationResultsReportComponent } from './pages/pl-remuneration-results-report/pl-remuneration-results-report.component';
import { CFHResultReportComponent } from './pages/cfhresult-report/cfhresult-report.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ClaimantClaimedOsdReportComponent,
    TransparencyComponent,
    LeftSidebarTransparencyComponent,
    OSDRevenueExpenditureEconomicResultReportComponent,
    PLRemunerationResultsReportComponent,
    CFHResultReportComponent
    ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    TranslateModule,
    SharedModule
  ]
})
export class ReportsModule { }
