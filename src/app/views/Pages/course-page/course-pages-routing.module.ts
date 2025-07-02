import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { CoursePageComponent } from './course-page.component';
import { CourseMainPageComponent } from 'src/app/views/Pages/course-page/course-main-page/course-main-page.component';

const routes: Routes = [
  // // Default path for recruiter redirects to 'recruiter/dashboard'


  { path: '', component:   CoursePageComponent, // Main layout component with sidebar
    children: [
    { path: '', component:  CourseMainPageComponent},
    ]
  },
  { path: '**', redirectTo: 'course-page' }, // Fallback rou
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoursePagesRoutingModule { }
