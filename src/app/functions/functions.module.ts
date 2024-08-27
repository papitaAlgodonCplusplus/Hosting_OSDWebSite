import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FunctionsRoutingModule } from './functions-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AutorizationPlComponent } from './pages/autorization-pl/autorization-pl.component';
import { AssignPLTRClaimsComponent } from './pages/assign-pltr-claims/assign-pltr-claims.component';
import { SubAuthorizedComponent } from './pages/sub-authorized/sub-authorized.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { CustomPaginator } from '../services/custom-paginator.service';
import { ClaimsFileComponent } from './pages/claims-file/claims-file.component';
import { FileManagerComponent } from './pages/file-manager/file-manager.component';
import { ClaimsPerformanceComponent } from './pages/claims-performance/claims-performance.component';
import { RestoreHistoryComponent } from './pages/restore-history/restore-history.component';
import { AuthorizedModalComponent } from './components/authorized-modal/authorized-modal.component';
import { AssignClientToTrainerComponent } from './pages/assign-client-to-trainer/assign-client-to-trainer.component';

@NgModule({
  declarations: [
    AutorizationPlComponent,
    AssignPLTRClaimsComponent,
    SubAuthorizedComponent,
    ClaimsFileComponent,
    FileManagerComponent,
    ClaimsPerformanceComponent,
    RestoreHistoryComponent,
    AuthorizedModalComponent,
    AssignClientToTrainerComponent
    ],
  imports: [
    CommonModule,
    FunctionsRoutingModule,
    SharedModule,
    FormsModule,
    TranslateModule,
    MatPaginatorModule,
    ReactiveFormsModule
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
