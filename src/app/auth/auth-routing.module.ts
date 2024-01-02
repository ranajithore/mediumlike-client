import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { EmailVerificationComponent } from './components/email-verification/email-verification.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

const routes: Routes = [
  { path: 'signin', pathMatch: 'full', component: SignInComponent },
  { path: 'signup', pathMatch: 'full', component: SignUpComponent },
  {
    path: 'verifyemail',
    pathMatch: 'full',
    component: EmailVerificationComponent,
  },
  {
    path: 'forgotpassword',
    pathMatch: 'full',
    component: ForgotPasswordComponent,
  },
  {
    path: 'resetpassword/:token',
    pathMatch: 'full',
    component: ResetPasswordComponent,
  },
  { path: '', pathMatch: 'full', redirectTo: 'signin' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
