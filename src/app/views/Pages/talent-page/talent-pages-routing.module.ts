import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { TalentPageComponent } from './talent-page.component';

import { TalentMainPageComponent } from './talent-main-page/talent-main-page.component';
import { TalentLoginComponent } from './talent-login/talent-login.component';
import { TalentSignUpComponent } from './talent-sign-up/talent-sign-up.component';
import { RegisterSeekerComponent } from './talent-sign-up/register-seeker/register-seeker.component';
import { RegisterRecruiterComponent } from './talent-sign-up/register-recruiter/register-recruiter.component';
import { ConfirmationComponent } from './talent-sign-up/account-confirmation/account-confirmation.component';
import { OtpVerificationPageComponent } from './talent-sign-up/otp-verification-page/otp-verification-page.component';
import { ForgotPasswordPageComponent } from './talent-sign-up/forgot-password-page/forgot-password-page.component';
import { ResetPasswordOtpPageComponent } from './talent-sign-up/reset-password-otp-page/reset-password-otp-page.component';
import { ResetPasswordPageComponent } from './talent-sign-up/reset-password-page/reset-password-page.component';
import { ChangePasswordPageComponent } from './talent-sign-up/change-password-page/change-password-page.component';
import { RoleGuard } from 'src/app/core/guards/role.guard';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
  // // Default path for recruiter redirects to 'recruiter/dashboard'


  { path: '', component:  TalentPageComponent, // Main layout component with sidebar
    children: [
    { path: '', component:  TalentMainPageComponent},
    { path: 'login', component:  TalentLoginComponent }, // Profile page route
    { path: 'signup', component: TalentSignUpComponent }, // Profile page route
    { path: 'forgot-password', component:  ForgotPasswordPageComponent }, // Profile page route
    { path: 'forgotPassword-otp-verification', component:  ResetPasswordOtpPageComponent}, // Profile page route
    { path: 'reset-password', component:  ResetPasswordPageComponent}, // Profile page route
    { path: 'change-password/:id', component:  ChangePasswordPageComponent}, // Profile page route
    { path: 'register/seeker', component: RegisterSeekerComponent }, // Profile page route
    { path: 'register/recruiter', component: RegisterRecruiterComponent }, // Profile page route
    { path: 'register/otp-verification', component:  OtpVerificationPageComponent }, // Profile page route
    { path: 'register/confirmation-page', component: ConfirmationComponent }, // Profile page route
    { path: 'recruiter',loadChildren: () => import('./Recruiter/recruiter-pages.module').then((m) => m.RecruiterPageModule),
      // canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'recruiter' }
    },
    { path: 'seeker',loadChildren: () => import('./Seeker/seeker-pages.module').then((m) => m.SeekerPageModule),
      // canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'seeker' }
    },
    { path: 'admin',loadChildren: () => import('./admin/admin-pages.module').then((m) => m.AdminPageModule),
      // canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'admin' }
    },
    ]
  },
  { path: '**', redirectTo: 'talent-page' }, // Fallback rou
  ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TalentPagesRoutingModule { }
