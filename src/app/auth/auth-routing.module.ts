import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';
import { authGuard } from '../guards/auth.guard';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { NewpasswordComponent } from './pages/newpassword/newpassword.component';

// Child routes of the auth model
const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'verify-email',
    canMatch: [authGuard],
    component: VerifyEmailComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'newpassword',
    component: NewpasswordComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
