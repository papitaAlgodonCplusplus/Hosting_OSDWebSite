import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FunctionsRoutingModule } from './functions-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { AutorizationPlComponent } from './autorization-pl/autorization-pl.component';
import { CustomPaginator } from './service/custom-paginator';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [
    AutorizationPlComponent,
    
    ],
  imports: [
    CommonModule,
    FunctionsRoutingModule,
    SharedModule,
    TranslateModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    FormsModule
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
export class FunctionsModule { }
