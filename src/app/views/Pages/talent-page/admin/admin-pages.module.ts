import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { AdminPageComponent } from './admin-page.component';
import { AdminPagesRoutingModule } from './admin-pages-routing.module';

import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminUserDataPageComponent } from './admin-user-data/admin-user-data.component';
import { LayoutModule } from "../../../Layouts/layout.module";
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
import { NgxEditorModule } from 'ngx-editor';

@NgModule({
  declarations: [
    AdminPageComponent,
    AdminDashboardComponent,
    AdminUserDataPageComponent,
    UniversityComponent,
    CompanyComponent,
    RecruiterComponent,
    SeekerComponent,
    RecruiterDetailsComponent,
    SeekerDetailsComponent,
    UniversityEditComponent,
    UniversityPostComponent,
    CompanyPostComponent,
    CompanyEditComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AdminPagesRoutingModule,
    LayoutModule,
    NgxEditorModule
],
  providers: [DatePipe],

})
export class AdminPageModule { }
