import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Public and Shared Components
import { MainPageComponent } from './views/Pages/main-page/main-page.component';
import { CoursePageComponent } from './views/Pages/course-page/course-page.component';
import { ForDeveloperComponent } from './views/Pages/for-developer/for-developer.component';
import { AboutPageComponent } from './views/Pages/about-page/about-page.component';
import { BlogPageComponent } from './views/Pages/blog-page/blog-page.component';
import { MarketPageComponent } from './views/Pages/market-page/market-page.component';
import { PublishPageComponent } from './views/Pages/publish-page/publish-page.component';
import { PurposePageComponent } from './views/Pages/purpose-page/purpose-page.component';
import { CloudPageComponent } from './views/Pages/cloud-page/cloud-page.component';
import { IntroductionLogoComponent } from './views/Pages/introduction-logo/introduction-logo.component';

const routes: Routes = [
  // Public routes
  { path: 'introduction', component: IntroductionLogoComponent, title: 'Introduction page' },
  { path: 'main', component: MainPageComponent, title: 'Main page' },
  { path: 'for-developer', component: ForDeveloperComponent, title: 'For Developer page' },
  { path: 'course-page', component: CoursePageComponent, title: 'Learn page' },
  { path: 'about-page', component: AboutPageComponent, title: 'About Page' },
  { path: 'blog-page', component: BlogPageComponent, title: 'Blog Page' },
  { path: 'market-page', component: MarketPageComponent, title: 'Market Page' },
  { path: 'publish-page', component: PublishPageComponent, title: 'Publish Page' },
  { path: 'purpose-page', component: PurposePageComponent, title: 'Purpose Page' },
  { path: 'cloud-page', component: CloudPageComponent, title: 'Cloud Page' },
  { path: 'talent-page', loadChildren: () => import('./views/Pages/talent-page/talent-pages.module').then((m) => m.TalentPageModule ), title: 'Talent Page' },
  { path: '**', redirectTo: 'main' }, // Fallback rou

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
