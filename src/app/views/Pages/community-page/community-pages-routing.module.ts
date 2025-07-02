import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CommunityPageComponent } from './community-page.component';
import { CommunityMainPageComponent } from './community-main-page/community-main-page.component';

const routes: Routes = [
  // // Default path for recruiter redirects to 'recruiter/dashboard'


  { path: '', component:   CommunityPageComponent, // Main layout component with sidebar
    children: [
    { path: '', component:   CommunityMainPageComponent },
    ]
  },
  { path: '**', redirectTo: 'community-page' }, // Fallback rou
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunityPagesRoutingModule { }
