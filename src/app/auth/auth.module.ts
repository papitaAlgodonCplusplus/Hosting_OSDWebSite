import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthRoutingModule } from './auth-routing.module';
import { InputPasswordComponent } from './components/input-password/input-password.component';
import { SharedModule } from '../shared/shared.module';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { NewpasswordComponent } from './pages/newpassword/newpassword.component';
import { InputNewpasswordComponent } from './components/input-newpassword/input-newpassword.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    InputPasswordComponent,
    VerifyEmailComponent,
    ForgotPasswordComponent,
    NewpasswordComponent,
    InputNewpasswordComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class AuthModule { }
