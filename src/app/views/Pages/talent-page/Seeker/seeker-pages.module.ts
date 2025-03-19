import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { SeekerMainPageComponent } from './seeker-main-page.component';
import { SeekerPagesRoutingModule } from './seeker-pages-routing.module';
import { SeekerPortfolioComponent } from './seeker-portfolio/seeker-portfolio.component';
import { SeekerDashboardComponent } from './seeker-dashboard/seeker-dashboard.component';
import { SeekerJobProfileComponent } from './seeker-jobProfile/seeker-jobProfile.component';
import { SeekerLaunchpadComponent } from './seeker-launchPad/seeker-launchPad.component';
import { SeekerManageProjectPageComponent } from './seeker-manage-project/seeker-manage-project.component';
import { SeekerPostProjectPageComponent } from './seeker-post-project/seeker-post-project.component';
import { LayoutModule } from '../../../Layouts/layout.module';
import { SharedModule } from '../../../shared/shared.module';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { SeekerEditProfileComponent } from './seeker-edit-profile/seeker-edit-profile.component';
import { SeekerProfileFormComponent } from './seeker-profile-form/seeker-profile-form.component';
import { NgxEditorModule } from 'ngx-editor';
import { SeekerEditProjectComponent } from './seeker-edit-project/seeker-edit-project.component';
import { SeekerProfilePageComponent } from './seeker-profile/seeker-profile-page.component';
import { SeekerAccountSettingsPageComponent } from './seeker-account-settings-page/seeker-account-settings-page.component';
import { NgChartsModule } from 'ng2-charts';
import { JobDetailsComponent } from './job-details/job-details.component';

@NgModule({
  declarations: [
    SeekerMainPageComponent,
    SeekerPortfolioComponent,
    SeekerDashboardComponent,
    SeekerJobProfileComponent,
    SeekerProfilePageComponent,
    SeekerLaunchpadComponent,
    SeekerManageProjectPageComponent,
    SeekerPostProjectPageComponent ,
    ProjectDetailsComponent,
    SeekerEditProfileComponent,
    SeekerProfileFormComponent,
    SeekerEditProjectComponent,
    SeekerAccountSettingsPageComponent,
    JobDetailsComponent

  ],
  imports: [
    CommonModule,
    SeekerPagesRoutingModule,
    HttpClientModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxEditorModule,
    NgChartsModule
  ],
  providers: [DatePipe],
})
export class SeekerPageModule { }
