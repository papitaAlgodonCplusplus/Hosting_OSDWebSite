import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FunctionsRoutingModule } from './functions-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AutorizationPlComponent } from './pages/autorization-pl/autorization-pl.component';
import { AssignPLTRClaimsComponent } from './pages/assign-pltr-claims/assign-pltr-claims.component';
import { AssignCfhFreeprofComponent } from './pages/assign-nfp/assign-nfp.component';
import { SubAuthorizedComponent } from './pages/sub-authorized/sub-authorized.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { CustomPaginator } from '../services/custom-paginator.service';
import { ClaimsFileComponent } from './pages/claims-file/claims-file.component';
import { FileManagerComponent } from './pages/file-manager/file-manager.component';
import { RestoreHistoryComponent } from './pages/restore-history/restore-history.component';
import { AuthorizedModalComponent } from './components/authorized-modal/authorized-modal.component';
import { AssignClientToTrainerComponent } from './pages/assign-client-to-trainer/assign-client-to-trainer.component';
import { AccountingServicesComponent } from './pages/accounting-services/accounting-services.component';
import { ClaimantAndClaimsCustomerPerformanceComponent } from './pages/claimant-and-claims-customer-performance/claimant-and-claims-customer-performance.component';
import { ClaimsTrainerPerformanceComponent } from './pages/claims-trainer-performance/claims-trainer-performance.component';
import { ClaimsProcessorPerformanceComponent } from './pages/claims-processor-performance/claims-processor-performance.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { UserProfileEditComponent } from './pages/edit-my-info/edit-my-info.component';
import { StudentRecordComponent } from './pages/students-management/student-record.component';
import { AccountingComponent } from './pages/accounting/accounting.component';
import { FpManagementComponent } from './pages/fp-management/fp-management.component'; // Import the new component

@NgModule({
  declarations: [
    AutorizationPlComponent,
    AssignPLTRClaimsComponent,
    AssignCfhFreeprofComponent,
    SubAuthorizedComponent,
    ClaimsFileComponent,
    FileManagerComponent,
    RestoreHistoryComponent,
    AuthorizedModalComponent,
    AssignClientToTrainerComponent,
    AccountingServicesComponent,
    ClaimantAndClaimsCustomerPerformanceComponent,
    ClaimsTrainerPerformanceComponent,
    ClaimsProcessorPerformanceComponent,
    TruncatePipe,
    StudentRecordComponent,
    UserProfileEditComponent,
    AccountingComponent,
    FpManagementComponent // Add the new component to declarations
  ],
  imports: [
    CommonModule,
    FunctionsRoutingModule,
    SharedModule,
    FormsModule,
    TranslateModule,
    MatPaginatorModule,
    ReactiveFormsModule,  // ✅ Already imported, correct
    MatSnackBarModule  // ✅ Already imported, correct
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
  ]
})
export class FunctionsModule { }
