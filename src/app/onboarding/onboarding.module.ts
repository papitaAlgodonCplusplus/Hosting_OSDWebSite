import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnboardingRoutingModule } from './onboarding-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { RegisterCfhComponent } from './pages/register-cfh/register-cfh.component';
import { OnboardingRegisterClaimantComponent } from './pages/onboarding-register-claimant/onboarding-register-claimant.component';
import { RegisterFreeProfessionalComponent } from './pages/register-free-professional/register-free-professional.component';
import { OnboardingRegisterTypeComponent } from './pages/onboarding-register-type/onboarding-register-type.component';
import { RegisterSubClientComponent } from './pages/register-sub-client/register-sub-client.component';



@NgModule({
  declarations: [
    OnboardingRegisterTypeComponent,
    RegisterCfhComponent,
    OnboardingRegisterClaimantComponent,
    RegisterFreeProfessionalComponent,
    RegisterSubClientComponent
  ],
  imports: [
    CommonModule,
    OnboardingRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
  ]
})
export class OnboardingModule { }
