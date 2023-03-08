import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MaterialModule } from 'src/app/material.module';
import { LoaderModule } from '../loader/loader.module';
import { AuthenticationComponent } from './authentication.component';
import { routing } from './authentication.routing';
import { ChartComponent } from './chart/chart.component';
import { ConfirmPasswordComponent } from './confirm-password/confirm-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginSuperAdminComponent } from './login-super-admin/login-super-admin.component';
import { LoginComponent } from './login/login.component';
import { RegistrationSkillownerComponent } from './registration-skillowner/registration-skillowner.component';
import { SetPasswordComponent } from './registration-skillowner/set-password/set-password.component';
import { RegistrationSkillpartnerComponent } from './registration-skillpartner/registration-skillpartner.component';
import { RegistrationSkillseekerComponent } from './registration-skillseeker/registration-skillseeker.component';
import { RegistrationComponent } from './registration/registration.component';

@NgModule({
  declarations: [
    AuthenticationComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ConfirmPasswordComponent,
    RegistrationComponent,
    ChartComponent,
    RegistrationSkillpartnerComponent,
    RegistrationSkillseekerComponent,
    RegistrationSkillownerComponent,
    SetPasswordComponent,
    LoginSuperAdminComponent,
  ],
  imports: [CommonModule, LoaderModule, FormsModule, ReactiveFormsModule, MaterialModule, BsDatepickerModule.forRoot(), routing],
})
export class AuthenticationModule {}
