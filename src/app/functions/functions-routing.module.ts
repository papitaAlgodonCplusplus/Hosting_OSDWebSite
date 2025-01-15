import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AutorizationPlComponent } from './pages/autorization-pl/autorization-pl.component';
import { AssignPLTRClaimsComponent } from './pages/assign-pltr-claims/assign-pltr-claims.component';
import { SubAuthorizedComponent } from './pages/sub-authorized/sub-authorized.component';
import { ClaimsFileComponent } from './pages/claims-file/claims-file.component';
import { StudentRecordComponent } from './pages/students-management/student-record.component';
import { AccountingComponent } from './pages/accounting/accounting.component';
import { FileManagerComponent } from './pages/file-manager/file-manager.component';
import { RestoreHistoryComponent } from './pages/restore-history/restore-history.component';
import { AssignClientToTrainerComponent } from './pages/assign-client-to-trainer/assign-client-to-trainer.component';
import { ClaimantAndClaimsCustomerPerformanceComponent } from './pages/claimant-and-claims-customer-performance/claimant-and-claims-customer-performance.component';
import { ClaimsTrainerPerformanceComponent } from './pages/claims-trainer-performance/claims-trainer-performance.component';
import { ClaimsProcessorPerformanceComponent } from './pages/claims-processor-performance/claims-processor-performance.component';

const routes: Routes = [
  {
    path: 'autorization-pl',
    component: AutorizationPlComponent
  },
  {
    path: 'assign-pltr-claims',
    component: AssignPLTRClaimsComponent
  },
  {
    path: 'sub-authorized',
    component: SubAuthorizedComponent
  },
  {
    path: 'claims-file',
    component: ClaimsFileComponent
  },
  {
    path: 'students-management',
    component: StudentRecordComponent
  },
  {
    path: 'accounting',
    component: AccountingComponent
  },
  {
    path: 'file-manager',
    component: FileManagerComponent
  },
  {
    path: 'claimant-and-claims-customer-performance',
    component: ClaimantAndClaimsCustomerPerformanceComponent
  },
  {
    path: 'claims-processor-performance',
    component: ClaimsProcessorPerformanceComponent
  },
  {
    path: 'claims-trainer-performance',
    component: ClaimsTrainerPerformanceComponent
  },
  {
    path: 'restore-history',
    component: RestoreHistoryComponent
  },
  {
    path:'assign-client-to-Trainer',
    component: AssignClientToTrainerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FunctionsRoutingModule { }
