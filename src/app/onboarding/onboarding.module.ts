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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthModule } from '../auth/auth.module';
import { SelectorRegistryClaimantComponent } from './pages/selector-registry-claimant/selector-registry-claimant.component';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { CustomPaginator } from '../services/custom-paginator.service';


@NgModule({
  
  declarations: [
    OnboardingRegisterTypeComponent,
    OnboardingRegisterCfhComponent,
    OnboardingRegisterClaimantComponent,
    OnboardingRegisterFreeProfessionalComponent,
    OnboardingRegisterSubClientComponent,
    SelectorRegistryClaimantComponent
  ],
  imports: [
    CommonModule,
    OnboardingRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    TranslateModule,
    AuthModule,
    MatPaginatorModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers:[
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
export class OnboardingModule { }
