import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FunctionsRoutingModule } from './functions-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { AutorizationPlComponent } from './autorization-pl/autorization-pl.component';
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
    FormsModule 
  ]
})
export class FunctionsModule { }
