import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageComponent } from './admin-page.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminUserDataPageComponent } from './admin-user-data/admin-user-data.component';
import { UniversityComponent } from './university/university.component';
import { CompanyComponent } from './company/company.component';
import { RecruiterComponent } from './recruiter/recruiter.component';
import { SeekerComponent } from './seeker/seeker.component';
import { RecruiterDetailsComponent } from './recruiter-details/recruiter-details.component';
import { SeekerDetailsComponent } from './seeker-details/seeker-details.component';
import { UniversityPostComponent } from './university-post/university-post.component';
import { UniversityEditComponent } from './university-edit/university-edit.component';
import { CompanyPostComponent } from './company-post/company-post.component';
import { CompanyEditComponent } from './company-edit/company-edit.component';
const routes: Routes = [
	// Default path for recruiter redirects to 'recruiter/dashboard'
	{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },

	{
	  path: '', component: AdminPageComponent, // Main layout component with sidebar
	  children: [
		{ path: 'dashboard', component: AdminDashboardComponent }, // Dashboard route
		{ path: 'user-data', component: AdminUserDataPageComponent } ,// Hire Seeker page route
    { path: 'university', component: UniversityComponent } ,// Hire Seeker page route
		{ path: 'company', component: CompanyComponent } ,// Hire Seeker page route
    { path: 'recruiter', component: RecruiterComponent } ,// Hire Seeker page route
		{ path: 'seeker', component: SeekerComponent} ,// Hire Seeker page route
    { path: 'recruiter-details/:id', component: RecruiterDetailsComponent } ,// Hire Seeker page route
		{ path: 'seeker-details/:id', component: SeekerDetailsComponent } ,// Hire Seeker page route
    { path: 'university-post-form', component: UniversityPostComponent } ,// Hire Seeker page route
    { path: 'university-edit-form/:id', component: UniversityEditComponent } ,// Hire Seeker page route
    { path: 'company-post-form', component: CompanyPostComponent } ,// Hire Seeker page route
    { path: 'company-edit-form/:id', component: CompanyEditComponent } ,// Hire Seeker page route
	  ]
	}
  ];



@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AdminPagesRoutingModule { }
