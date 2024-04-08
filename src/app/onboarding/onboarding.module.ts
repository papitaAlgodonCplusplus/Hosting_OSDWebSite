import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnboardingRoutingModule } from './onboarding-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { OnboardingRegisterCfhComponent } from './pages/onboarding-register-cfh/onboarding-register-cfh.component';
import { OnboardingRegisterClaimantComponent } from './pages/onboarding-register-claimant/onboarding-register-claimant.component';
import { OnboardingRegisterFreeProfessionalComponent } from './pages/onboarding-register-free-professional/onboarding-register-free-professional.component';
import { OnboardingRegisterTypeComponent } from './pages/onboarding-register-type/onboarding-register-type.component';
import { OnboardingRegisterSubClientComponent } from './pages/onboarding-register-sub-client/onboarding-register-sub-client.component';
import { TranslateModule } from '@ngx-translate/core';
import { AuthModule } from '../auth/auth.module';
import { MatPaginator } from '@angular/material/paginator';



@NgModule({
  
  declarations: [
    OnboardingRegisterTypeComponent,
    OnboardingRegisterCfhComponent,
    OnboardingRegisterClaimantComponent,
    OnboardingRegisterFreeProfessionalComponent,
    OnboardingRegisterSubClientComponent
  ],
  imports: [
    CommonModule,
    OnboardingRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    TranslateModule,
    AuthModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OnboardingModule { }
