import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransparencyComponent } from './pages/transparency/transparency.component';
import { CFHResultReportComponent } from './pages/cfhresult-report/cfhresult-report.component';
import { ClaimantClaimedOsdReportComponent } from './pages/claimant-claimed-osd-report/claimant-claimed-osd-report.component';
import { OSDRevenueExpenditureEconomicResultReportComponent } from './pages/osd-revenue-expenditure-economic-result-report/osd-revenue-expenditure-economic-result-report.component';
import { ReporteHorasComponent } from './pages/dev_hours/dev_hours.component';
import { PLRemunerationResultsReportComponent } from './pages/pl-remuneration-results-report/pl-remuneration-results-report.component';

const routes: Routes = [

  {
    path: '',
    component: TransparencyComponent
  },
  
      {
        path: 'Step1',
        component : CFHResultReportComponent
      },
      {
        path: 'Step2',
        component : ClaimantClaimedOsdReportComponent
      },
      {
        path: 'Step3',
        component : OSDRevenueExpenditureEconomicResultReportComponent
      },
      {
        path: 'Step4',
        component : PLRemunerationResultsReportComponent
      },
      {
        path: 'Step5',
        component : ReporteHorasComponent
      }
    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
