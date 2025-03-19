import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { TalentPageComponent } from './talent-page.component';
import { TalentMainPageComponent } from './talent-main-page/talent-main-page.component';
import { TalentLoginComponent } from './talent-login/talent-login.component';
import { TalentSignUpComponent } from './talent-sign-up/talent-sign-up.component';
import { RegisterSeekerComponent } from './talent-sign-up/register-seeker/register-seeker.component';
import { RegisterRecruiterComponent } from './talent-sign-up/register-recruiter/register-recruiter.component';
import { ConfirmationComponent } from './talent-sign-up/account-confirmation/account-confirmation.component';

import { TalentPagesRoutingModule } from './talent-pages-routing.module';
import { RecruiterPageModule } from './Recruiter/recruiter-pages.module';
import { LayoutModule } from '../../Layouts/layout.module';
import { SharedModule } from '../../shared/shared.module';
import { SeekerPageModule } from './Seeker/seeker-pages.module';
import { AdminPageModule } from './admin/admin-pages.module';
import { OtpVerificationPageComponent } from './talent-sign-up/otp-verification-page/otp-verification-page.component';
import { ChangePasswordPageComponent } from './talent-sign-up/change-password-page/change-password-page.component';
@NgModule({
  declarations: [
    TalentPageComponent,
    TalentMainPageComponent,
    TalentLoginComponent,
    TalentSignUpComponent,
    RegisterSeekerComponent,
    RegisterRecruiterComponent,
    ConfirmationComponent,
    OtpVerificationPageComponent,
    ChangePasswordPageComponent,
  ],
  imports: [
    CommonModule,
    TalentPagesRoutingModule,
    HttpClientModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RecruiterPageModule,
    SeekerPageModule,
    AdminPageModule,
  ],
  providers: [DatePipe],
})
export class TalentPageModule { }
