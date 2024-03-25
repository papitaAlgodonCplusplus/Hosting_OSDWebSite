import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FunctionsRoutingModule } from './functions-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { AutorizationPlComponent } from './autorization-pl/autorization-pl.component';

@NgModule({
  declarations: [
    AutorizationPlComponent,
    
    ],
  imports: [
    CommonModule,
    FunctionsRoutingModule,
    SharedModule
  ]
})
export class FunctionsModule { }
