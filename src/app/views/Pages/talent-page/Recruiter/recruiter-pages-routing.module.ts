import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecruiterMainPageComponent } from './recruiter-main-page.component';
import { RecruiterHireSeekerPageComponent } from './recruiter-hire-seeker/recruiter-hire-seeker.component';
import { RecruiterDashboardComponent } from './recruiter-dashboard/recruiter-dashboard.component';
import { RecruiterPostJobPageComponent } from './recruiter-post-job/recruiter-post-job.component';
import { RecruiterManageJobPageComponent } from './recruiter-manage-job/recruiter-manage-job.component';
import { RecruiterClosedJobsPageComponent } from './recruiter-closed-jobs/recruiter-closed-jobs.component';
import { RecruiterJobApplicantsPageComponent } from './recruiter-job-applicants/recruiter-job-applicants.component';
import { RecruiterEditJobPageComponent } from './recruiter-edit-job/job-post-edit-form.component';
import { RecruiterSeekerProfileComponent } from './recruiter-seeker-profile/recruiter-seeker-profile.component';
import { RecruiterEditProfileComponent } from './recruiter-edit-profile/recruiter-edit-profile.component';
import { RecruiterProfileFormComponent } from './recruiter-profile-form/recruiter-profile-form.component';
import { JobpostJobApplicantsComponent } from './jobpost-job-applicants/jobpost-job-applicants.component';
import { RecruiterProfilePageComponent } from './recruiter-profile/recruiter-profile-page.component';
import { SettingsPageComponent } from './settings-page/settings-page.component';
import { RecruiterAccountSettingsPageComponent } from './recruiter-account-settings-page/recruiter-account-settings-page.component';

const routes: Routes = [
	// Default path for recruiter redirects to 'recruiter/dashboard'
	{ path: '', redirectTo: 'profile', pathMatch: 'full' },

	{ path: 'profile-form', component: RecruiterProfileFormComponent, title: 'Recruiter Fill Profile Page' },


	{ path: '', component: RecruiterMainPageComponent, // Main layout component with sidebar
	  children: [
		// { path: 'dashboard', component: RecruiterDashboardComponent, title: 'Recruiter dashboard page'  }, // Dashboard route
		{ path: 'profile', component:RecruiterProfilePageComponent, title:"Recruiter profile page"},
		{ path: 'post-job', component: RecruiterPostJobPageComponent, title: 'Post Jobpost Page'  } ,// Hire Seeker page route
		{ path: 'manage-jobs', component: RecruiterManageJobPageComponent, title: 'Manage Jobpost Page'  } ,// Hire Seeker page route
		{ path: 'view-jobPost/:id', component:  RecruiterEditJobPageComponent,  title: 'View Jobpost Page'  },
		{ path: 'closed-jobs', component: RecruiterClosedJobsPageComponent,  title: 'Closed Jobs Page'  } ,// Hire Seeker page route
		{ path: 'job-applicants', component: RecruiterJobApplicantsPageComponent, title: 'Job Applicants Page'  } ,// Hire Seeker page route
    { path: 'jobpost/:jobPostId/applicants', component: JobpostJobApplicantsComponent, title: 'Job Applicants Page'  } ,// Hire Seeker page route
		{ path: 'hire-seeker', component: RecruiterHireSeekerPageComponent, title: 'Hire Seeker Page'  }, // Hire Seeker page route
    { path: ':recruiterId/seeker-profile/:id', component: RecruiterSeekerProfileComponent, title: 'Seeker Profile Page' },
		{ path: 'profile-form', component: RecruiterProfileFormComponent, title: 'Recruiter Fill Profile Page' },
    { path: 'account-settings/:id', component: RecruiterAccountSettingsPageComponent , title: 'Recruiter account-settings page' },
    { path: 'edit-profile/:id', component: RecruiterEditProfileComponent, title: 'Recruiter Edit Profile Page' },
	  ]
	}
  ];



@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class RecruiterPagesRoutingModule { }
