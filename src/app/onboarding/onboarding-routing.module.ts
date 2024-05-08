import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnboardingRegisterTypeComponent } from './pages/onboarding-register-type/onboarding-register-type.component';
import { OnboardingRegisterClaimantComponent } from './pages/onboarding-register-claimant/onboarding-register-claimant.component';
import { OnboardingRegisterSubClientComponent } from './pages/onboarding-register-sub-client/onboarding-register-sub-client.component';
import { OnboardingRegisterCfhComponent } from './pages/onboarding-register-cfh/onboarding-register-cfh.component';
import { OnboardingRegisterFreeProfessionalComponent } from './pages/onboarding-register-free-professional/onboarding-register-free-professional.component';
import { SelectorRegistryClaimantComponent } from './pages/selector-registry-claimant/selector-registry-claimant.component';
const routes: Routes = [
  {
    path: 'onboarding-register',
    component: OnboardingRegisterTypeComponent
  },
  {
    path: 'onboarding-register-claimant/:selectorRegistry',
    component: OnboardingRegisterClaimantComponent
  },
  {
    path: 'onboarding-register-cfh',
    component: OnboardingRegisterCfhComponent
  },
  {
    path: 'onboarding-register-sub-client',
    component:OnboardingRegisterSubClientComponent
  },
  {
    path: 'onboarding-register-free-professional',
    component:OnboardingRegisterFreeProfessionalComponent
  },
  {
    path: 'selector-registry-claimant',
    component:SelectorRegistryClaimantComponent
  },
  {
    path: '',
    redirectTo: 'onboarding-register',
    pathMatch: 'full'
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnboardingRoutingModule { }
