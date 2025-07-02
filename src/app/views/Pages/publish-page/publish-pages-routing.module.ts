import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { PublishMainPageComponent } from './publish-main-page/publish-main-page.component';
import { PublishPageComponent } from './publish-page.component';


const routes: Routes = [
  // // Default path for recruiter redirects to 'recruiter/dashboard'


  { path: '', component:   PublishPageComponent , // Main layout component with sidebar
    children: [
    { path: '', component:  PublishMainPageComponent},
    ]
  },
  { path: '**', redirectTo: 'publish-page' }, // Fallback rou
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublishPagesRoutingModule { }
