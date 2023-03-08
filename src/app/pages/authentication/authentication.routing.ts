import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmPasswordComponent } from './confirm-password/confirm-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginSuperAdminComponent } from './login-super-admin/login-super-admin.component';
import { LoginComponent } from './login/login.component';
import { RegistrationSkillownerComponent } from './registration-skillowner/registration-skillowner.component';
import { SetPasswordComponent } from './registration-skillowner/set-password/set-password.component';
import { RegistrationSkillpartnerComponent } from './registration-skillpartner/registration-skillpartner.component';
import { RegistrationSkillseekerComponent } from './registration-skillseeker/registration-skillseeker.component';
import { RegistrationComponent } from './registration/registration.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'activation', component: ConfirmPasswordComponent },
  { path: 'registration', component: RegistrationComponent },
  {
    path: 'registration/skillpartner',
    component: RegistrationSkillpartnerComponent,
  },
  {
    path: 'registration/skillseeker',
    component: RegistrationSkillseekerComponent,
  },
  { path: 'activation/skillowner', component: RegistrationSkillownerComponent },
  {
    path: 'activation/skillowner/set-password/:id',
    component: SetPasswordComponent,
  },
  { path: 'login-superadmin', component: LoginSuperAdminComponent },
  { path: '', component: RegistrationComponent },
];

export const routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
