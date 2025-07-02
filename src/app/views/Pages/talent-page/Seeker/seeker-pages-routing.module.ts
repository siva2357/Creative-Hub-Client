import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeekerMainPageComponent } from './seeker-main-page.component';
import { SeekerPortfolioComponent } from './seeker-portfolio/seeker-portfolio.component';
import { SeekerDashboardComponent } from './seeker-dashboard/seeker-dashboard.component';
import { SeekerJobProfileComponent } from './seeker-jobProfile/seeker-jobProfile.component';
import { SeekerLaunchpadComponent } from './seeker-launchPad/seeker-launchPad.component';
import { SeekerPostProjectPageComponent } from './seeker-post-project/seeker-post-project.component';
import { SeekerManageProjectPageComponent } from './seeker-manage-project/seeker-manage-project.component';
import { SeekerEditProfileComponent } from './seeker-edit-profile/seeker-edit-profile.component';
import { SeekerProfileFormComponent } from './seeker-profile-form/seeker-profile-form.component';
import { SeekerEditProjectComponent } from './seeker-edit-project/seeker-edit-project.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { SeekerProfilePageComponent } from './seeker-profile/seeker-profile-page.component';
import { SeekerAccountSettingsPageComponent } from './seeker-account-settings-page/seeker-account-settings-page.component';
import { JobDetailsComponent } from './job-details/job-details.component';
const routes: Routes = [
		{ path: 'profile-form', component: SeekerProfileFormComponent, title: 'Seeker Fill Profile Page' },
	{ path: '', component:  SeekerMainPageComponent, // Main layout component with sidebar
	  children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
		{ path: 'dashboard', component: SeekerDashboardComponent,  title: 'Seeker dashboard page'   }, // Profile page route
		{ path: 'profile',component: SeekerProfilePageComponent,  title: 'Seeker profile page'},
		{ path: 'post-project', component: SeekerPostProjectPageComponent, title: 'Seeker post project Page'   }, // Profile page route
		{ path: 'manage-project', component: SeekerManageProjectPageComponent,  title: 'Seeker manage project Page'   }, // Profile page route
		{ path: 'portfolio', component: SeekerPortfolioComponent,  title: 'Seeker portfolio Page'   }, // Profile page route
		{ path: 'jobProfile', component: SeekerJobProfileComponent,  title: 'Seeker Job Profile Page'   }, // Profile page route
		{ path: 'launchPad', component: SeekerLaunchpadComponent , title: 'Seeker LaunchPad Page'  }, // Profile page route
    { path: 'edit-project/:projectId', component: SeekerEditProjectComponent,  title: 'Seeker Project details Page'   }, // Profile page route
    { path: 'project-details/:projectId', component: ProjectDetailsComponent,  title: 'Seeker Project details Page'   }, // Profile page route
    { path: 'edit-profile/:id', component: SeekerEditProfileComponent, title: 'Seeker Edit Profile Page' },
    { path: 'account-settings/:id', component: SeekerAccountSettingsPageComponent , title: 'Seeker account-settings page' },
    { path: 'job-details/:id', component: JobDetailsComponent , title: 'Seeker job details page' },

	  ]
	}
  ];


@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SeekerPagesRoutingModule { }
