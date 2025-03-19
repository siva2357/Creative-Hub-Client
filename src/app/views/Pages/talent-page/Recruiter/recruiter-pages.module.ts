
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { RecruiterHireSeekerPageComponent } from './recruiter-hire-seeker/recruiter-hire-seeker.component';
import { RecruiterMainPageComponent } from './recruiter-main-page.component';
import { RecruiterPagesRoutingModule } from './recruiter-pages-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { RecruiterDashboardComponent } from './recruiter-dashboard/recruiter-dashboard.component';
import { RecruiterPostJobPageComponent } from './recruiter-post-job/recruiter-post-job.component';
import { RecruiterManageJobPageComponent } from './recruiter-manage-job/recruiter-manage-job.component';
import { RecruiterClosedJobsPageComponent } from './recruiter-closed-jobs/recruiter-closed-jobs.component';
import { RecruiterJobApplicantsPageComponent } from './recruiter-job-applicants/recruiter-job-applicants.component';
import { RecruiterEditJobPageComponent } from './recruiter-edit-job/job-post-edit-form.component';
import { LayoutModule } from "../../../Layouts/layout.module";
import { RecruiterEditProfileComponent } from './recruiter-edit-profile/recruiter-edit-profile.component';
import { RecruiterProfileFormComponent } from './recruiter-profile-form/recruiter-profile-form.component';
import { NgxEditorModule } from 'ngx-editor';
import { JobpostJobApplicantsComponent } from './jobpost-job-applicants/jobpost-job-applicants.component';
import { RecruiterProfilePageComponent } from './recruiter-profile/recruiter-profile-page.component';
import { SettingsPageComponent } from './settings-page/settings-page.component';
import { NgChartsModule } from 'ng2-charts';
import { RecruiterAccountSettingsPageComponent } from './recruiter-account-settings-page/recruiter-account-settings-page.component';



@NgModule({
  declarations: [
    RecruiterMainPageComponent,
    RecruiterHireSeekerPageComponent,
    RecruiterDashboardComponent,
    RecruiterPostJobPageComponent,
    RecruiterManageJobPageComponent,
    RecruiterClosedJobsPageComponent,
    RecruiterJobApplicantsPageComponent,
    RecruiterEditJobPageComponent,
    RecruiterEditProfileComponent,
    RecruiterProfileFormComponent,
    JobpostJobApplicantsComponent,
    RecruiterProfilePageComponent,
    SettingsPageComponent,
    RecruiterAccountSettingsPageComponent
  ],
  imports: [
    CommonModule,
    RecruiterPagesRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    LayoutModule,
    NgxEditorModule,
    NgChartsModule,

],
  providers: [DatePipe],
})
export class RecruiterPageModule { }
