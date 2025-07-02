import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainPageComponent } from './views/Pages/main-page/main-page.component';

const routes: Routes = [
  // Public routes
  { path: 'main', component: MainPageComponent, title: 'Main page' },
  { path: 'talent-page', loadChildren: () => import('./views/Pages/talent-page/talent-pages.module').then((m) => m.TalentPageModule ), title: 'Talent Page' },
    { path: 'course-page', loadChildren: () => import('./views/Pages/course-page/course-pages.module').then((m) => m.CoursePageModule ), title: 'Course Page' },
    { path: 'community-page', loadChildren: () => import('./views/Pages/community-page/community-pages.module').then((m) => m.CommunityPageModule ), title: 'Course Page' },
    { path: 'publish-page', loadChildren: () => import('./views/Pages/publish-page/publish-pages.module').then((m) => m.PublishPageModule ), title: 'Course Page' },


  { path: '**', redirectTo: 'main' }, // Fallback rou

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
