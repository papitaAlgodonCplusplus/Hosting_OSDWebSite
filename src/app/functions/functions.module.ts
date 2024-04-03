import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FunctionsRoutingModule } from './functions-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AutorizationPlComponent } from './pages/autorization-pl/autorization-pl.component';
import { AssignPLTRClaimsComponent } from './pages/assign-pltr-claims/assign-pltr-claims.component';
import { SubAuthorizedComponent } from './pages/sub-authorized/sub-authorized.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AutorizationPlComponent,
    AssignPLTRClaimsComponent,
    SubAuthorizedComponent
    ],
  imports: [
    CommonModule,
    FunctionsRoutingModule,
    SharedModule,
    FormsModule,
    TranslateModule,

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FunctionsModule { }
