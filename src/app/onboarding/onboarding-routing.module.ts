import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnboardingRegisterTypeComponent } from './pages/onboarding-register-type/onboarding-register-type.component';
import { OnboardingRegisterClaimantComponent } from './pages/onboarding-register-claimant/onboarding-register-claimant.component';



const routes: Routes = [
  {
    path: 'onboarding-register',
    component: OnboardingRegisterTypeComponent
  },
  {
    path: 'onboarding-register-claimant',
    component: OnboardingRegisterClaimantComponent
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
